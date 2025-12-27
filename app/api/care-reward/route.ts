/**
 * Care Reward Signing API
 * 
 * Backend endpoint for signing care reward claims.
 * Users submit care actions and receive signed messages
 * to claim tokens from the DonutamagotchiToken contract.
 * 
 * Security:
 * - Server-side signature with private key
 * - Nonce tracking to prevent replay
 * - Rate limiting per address
 * - Action verification
 */

import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, keccak256, encodePacked, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

// Types
interface CareRewardRequest {
    address: string;
    action: "feeding" | "petting" | "daily_checkin" | "playing";
}

interface CareRewardResponse {
    to: string;
    amount: string;
    reason: string;
    nonce: number;
    signature: string;
}

// Care reward amounts (in tokens - 18 decimals)
const CARE_REWARDS: Record<string, bigint> = {
    feeding: 10n * 10n ** 18n,      // 10 tokens per feed
    petting: 2n * 10n ** 18n,       // 2 tokens per pet
    daily_checkin: 5n * 10n ** 18n, // 5 tokens for daily checkin
    playing: 3n * 10n ** 18n,       // 3 tokens per play
};

// In-memory nonce tracking (would be DB in production)
const nonces: Map<string, number> = new Map();

// Rate limiting: max actions per address per hour
const actionCounts: Map<string, { count: number; resetTime: number }> = new Map();
const MAX_ACTIONS_PER_HOUR = 10;

function getNonce(address: string): number {
    const current = nonces.get(address.toLowerCase()) || 0;
    nonces.set(address.toLowerCase(), current + 1);
    return current;
}

function checkRateLimit(address: string): boolean {
    const now = Date.now();
    const key = address.toLowerCase();
    const entry = actionCounts.get(key);

    if (!entry || now > entry.resetTime) {
        // Reset counter
        actionCounts.set(key, { count: 1, resetTime: now + 3600000 }); // 1 hour
        return true;
    }

    if (entry.count >= MAX_ACTIONS_PER_HOUR) {
        return false;
    }

    entry.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Get signer private key from environment
        const signerPrivateKey = process.env.CARE_SIGNER_PRIVATE_KEY;

        if (!signerPrivateKey) {
            // In development, return mock signature for testing
            const body = (await request.json()) as CareRewardRequest;
            return NextResponse.json({
                to: body.address,
                amount: CARE_REWARDS[body.action]?.toString() || "0",
                reason: body.action,
                nonce: getNonce(body.address),
                signature: "0x", // Empty signature for dev
                mock: true,
            });
        }

        // Parse request
        const body = (await request.json()) as CareRewardRequest;

        if (!body.address || !body.action) {
            return NextResponse.json(
                { error: "Missing address or action" },
                { status: 400 }
            );
        }

        // Validate action
        if (!CARE_REWARDS[body.action]) {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }

        // Check rate limit
        if (!checkRateLimit(body.address)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                { status: 429 }
            );
        }

        // Get reward amount
        const amount = CARE_REWARDS[body.action];
        const nonce = getNonce(body.address);

        // Create signer
        const account = privateKeyToAccount(signerPrivateKey as Hex);

        // Create message hash (matches contract: keccak256(abi.encodePacked(to, amount, reason, nonce)))
        const messageHash = keccak256(
            encodePacked(
                ["address", "uint256", "string", "uint256"],
                [body.address as Hex, amount, body.action, BigInt(nonce)]
            )
        );

        // Sign the message (eth_sign style with prefix)
        const client = createWalletClient({
            account,
            chain: base,
            transport: http(),
        });

        const signature = await client.signMessage({
            message: { raw: messageHash as Hex },
        });

        const response: CareRewardResponse = {
            to: body.address,
            amount: amount.toString(),
            reason: body.action,
            nonce,
            signature,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Care reward signing error:", error);
        return NextResponse.json(
            { error: "Failed to sign care reward" },
            { status: 500 }
        );
    }
}

// GET for health check
export async function GET() {
    return NextResponse.json({
        status: "ok",
        rewards: Object.fromEntries(
            Object.entries(CARE_REWARDS).map(([k, v]) => [k, (v / 10n ** 18n).toString()])
        ),
        rateLimit: `${MAX_ACTIONS_PER_HOUR} actions per hour`,
    });
}
