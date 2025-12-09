'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'
import { wagmiConfig } from '@/lib/wagmi'

const DONUTAMAGOTCHI_TOKEN_ABI = [
  {
    name: 'getCosmeticsBreakdown',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalRevenue', type: 'uint256' },
      { name: 'lockedForLP', type: 'uint256' },
      { name: 'burned', type: 'uint256' },
      { name: 'toTreasury', type: 'uint256' },
      { name: 'lpLockPercentage', type: 'uint256' },
      { name: 'burnPercentage', type: 'uint256' },
      { name: 'treasuryPercentage', type: 'uint256' },
    ],
  },
  {
    name: 'getTeamVestingInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalAllocation', type: 'uint256' },
      { name: 'claimed', type: 'uint256' },
      { name: 'remaining', type: 'uint256' },
      { name: 'monthlyRelease', type: 'uint256' },
      { name: 'elapsedMonths', type: 'uint256' },
      { name: 'vestingDuration', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'isFullyVested', type: 'bool' },
    ],
  },
] as const

interface CosmeticsData {
  totalRevenue: bigint
  lockedForLP: bigint
  burned: bigint
  toTreasury: bigint
  lpLockPercentage: number
  burnPercentage: number
  treasuryPercentage: number
}

interface VestingData {
  totalAllocation: bigint
  claimed: bigint
  remaining: bigint
  monthlyRelease: bigint
  elapsedMonths: bigint
  vestingDuration: bigint
  startTime: bigint
  isFullyVested: boolean
}

export function TransparencyDashboard() {
  const { isConnected } = useAccount()
  const [data, setData] = useState<CosmeticsData | null>(null)
  const [vestingData, setVestingData] = useState<VestingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Note: Replace with actual deployed token address
        const tokenAddress = process.env.NEXT_PUBLIC_DONUTAMAGOTCHI_TOKEN as `0x${string}`

        const [cosmeticResult, vestingResult] = await Promise.all([
          readContract(wagmiConfig, {
            address: tokenAddress,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: 'getCosmeticsBreakdown',
          }),
          readContract(wagmiConfig, {
            address: tokenAddress,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: 'getTeamVestingInfo',
          }),
        ])

        setData({
          totalRevenue: cosmeticResult[0],
          lockedForLP: cosmeticResult[1],
          burned: cosmeticResult[2],
          toTreasury: cosmeticResult[3],
          lpLockPercentage: Number(cosmeticResult[4]),
          burnPercentage: Number(cosmeticResult[5]),
          treasuryPercentage: Number(cosmeticResult[6]),
        })

        setVestingData({
          totalAllocation: vestingResult[0],
          claimed: vestingResult[1],
          remaining: vestingResult[2],
          monthlyRelease: vestingResult[3],
          elapsedMonths: vestingResult[4],
          vestingDuration: vestingResult[5],
          startTime: vestingResult[6],
          isFullyVested: vestingResult[7],
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch transparency data',
        )
      } finally {
        setLoading(false)
      }
    }

    if (isConnected) {
      fetchData()
      // Refresh every 5 minutes
      const interval = setInterval(fetchData, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  const formatTokens = (amount: bigint) => {
    const decimals = 18
    const value = Number(amount) / Math.pow(10, decimals)
    return value.toFixed(2)
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold mb-2">🔗 Connect Wallet to View</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to see real-time transparency data
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 text-center">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 rounded-lg p-6 text-center text-red-700 dark:text-red-200">
        <p>⚠️ Error loading data: {error}</p>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🌍 Ecosystem Transparency</h2>
        <p className="text-blue-100">
          Real-time proof of Donutamagotchi&apos;s commitment to the $DONUT ecosystem
        </p>
      </div>

      {/* Community Alignment Message */}
      <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 rounded-lg p-6">
        <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">
          ✅ Community-First Economics
        </h3>
        <p className="text-green-700 dark:text-green-300 text-sm mb-3">
          We lock LP and burn tokens. Every cosmetic purchase directly strengthens the $DONUT
          ecosystem. Team and community interests are permanently aligned.
        </p>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>• 25% → Locked $DONUT-WETH LP (permanent liquidity)</li>
          <li>• 30% → Token burns (deflation, holder benefit)</li>
          <li>• 45% → Treasury (ecosystem operations)</li>
        </ul>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Cosmetics Revenue</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatTokens(data.totalRevenue)} $DONUTAMAGOTCHI
            </p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      {/* Revenue Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Locked for LP */}
        <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                Locked for LP
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatTokens(data.lockedForLP)}
              </p>
            </div>
            <div className="text-3xl">🔒</div>
          </div>
          <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{
                width:
                  data.totalRevenue > 0n
                    ? `${(Number(data.lockedForLP) / Number(data.totalRevenue)) * 100}%`
                    : '0%',
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {data.lpLockPercentage}% of all cosmetics
          </p>
        </div>

        {/* Burned */}
        <div className="bg-red-50 dark:bg-red-900 rounded-lg p-6 border border-red-200 dark:border-red-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Tokens Burned</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatTokens(data.burned)}
              </p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
          <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full"
              style={{
                width:
                  data.totalRevenue > 0n
                    ? `${(Number(data.burned) / Number(data.totalRevenue)) * 100}%`
                    : '0%',
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {data.burnPercentage}% deflation
          </p>
        </div>

        {/* Treasury */}
        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Treasury</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatTokens(data.toTreasury)}
              </p>
            </div>
            <div className="text-3xl">💳</div>
          </div>
          <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{
                width:
                  data.totalRevenue > 0n
                    ? `${(Number(data.toTreasury) / Number(data.totalRevenue)) * 100}%`
                    : '0%',
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {data.treasuryPercentage}% operations
          </p>
        </div>
      </div>

      {/* Verification Section */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">
          ✓ On-Chain Verification
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          All numbers above are verified on-chain. You can audit them anytime:
        </p>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-mono text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              getCosmeticsBreakdown()
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              - View all breakdowns
            </span>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-mono text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              lpLockAddress
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              - Check locked LP on Uniswap/Dexscreener
            </span>
          </p>
        </div>
      </div>

      {/* Team Vesting Section */}
      {vestingData && (
        <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
          <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-4">
            👨‍💻 Team Allocation (7.5% Vested)
          </h3>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
            Solo dev, linear vesting over 12 months (~0.625% per month). Fair, transparent, and
            auditable.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Total Allocation</p>
              <p className="font-bold text-orange-800 dark:text-orange-200">
                {formatTokens(vestingData.totalAllocation)}
              </p>
            </div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Claimed</p>
              <p className="font-bold text-orange-800 dark:text-orange-200">
                {formatTokens(vestingData.claimed)}
              </p>
            </div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Remaining</p>
              <p className="font-bold text-orange-800 dark:text-orange-200">
                {formatTokens(vestingData.remaining)}
              </p>
            </div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Monthly Release</p>
              <p className="font-bold text-orange-800 dark:text-orange-200">
                {formatTokens(vestingData.monthlyRelease)}
              </p>
            </div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Elapsed Months</p>
              <p className="font-bold text-orange-800 dark:text-orange-200">
                {Number(vestingData.elapsedMonths)} / 12
              </p>
            </div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Status</p>
              <p className="font-bold text-orange-800 dark:text-orange-200">
                {vestingData.isFullyVested ? '✓ Fully Vested' : 'Vesting...'}
              </p>
            </div>
          </div>

          {/* Vesting Progress Bar */}
          <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-3">
            <div
              className="bg-orange-600 h-3 rounded-full transition-all"
              style={{
                width: `${Math.min((Number(vestingData.elapsedMonths) / 12) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
            {Math.min((Number(vestingData.elapsedMonths) / 12) * 100, 100).toFixed(1)}% vested
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6 border-l-4 border-blue-500">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          📊 This dashboard updates every 5 minutes. Check back regularly to see the ecosystem
          grow stronger.
        </p>
      </div>
    </div>
  )
}
