'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'
import { wagmiConfig } from '@/lib/wagmi'
import { CONTRACT_ADDRESSES, DONUTAMAGOTCHI_TOKEN_ABI } from '@/lib/contracts'
import { formatEther } from 'viem'

interface StakingData {
  totalStaked: bigint
  feePool: bigint
  totalDistributed: bigint
}

interface UserStakingData {
  staked: bigint
  pending: bigint
  hasDpsBoost: boolean
}

export function TransparencyDashboard() {
  const { isConnected, address } = useAccount()
  const [stakingData, setStakingData] = useState<StakingData | null>(null)
  const [userStaking, setUserStaking] = useState<UserStakingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const tokenAddress = CONTRACT_ADDRESSES.donutamagotchiToken as `0x${string}`

        // Skip if token not deployed
        if (tokenAddress === '0x0000000000000000000000000000000000000000') {
          setLoading(false)
          return
        }

        // Fetch global staking data
        const [totalStaked, feePool] = await Promise.all([
          readContract(wagmiConfig, {
            address: tokenAddress,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: 'totalStaked',
          }),
          readContract(wagmiConfig, {
            address: tokenAddress,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: 'feePool',
          }),
        ])

        setStakingData({
          totalStaked: totalStaked as bigint,
          feePool: feePool as bigint,
          totalDistributed: 0n, // Would need to track this separately
        })

        // Fetch user staking data if connected
        if (address) {
          const userInfo = await readContract(wagmiConfig, {
            address: tokenAddress,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: 'getStakingInfo',
            args: [address],
          }) as [bigint, bigint, boolean, bigint, bigint]

          setUserStaking({
            staked: userInfo[0],
            pending: userInfo[1],
            hasDpsBoost: userInfo[2],
          })
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch data',
        )
      } finally {
        setLoading(false)
      }
    }

    if (isConnected) {
      fetchData()
      const interval = setInterval(fetchData, 30 * 1000) // Refresh every 30s
      return () => clearInterval(interval)
    }
  }, [isConnected, address])

  const formatTokens = (amount: bigint) => {
    const value = Number(amount) / 1e18
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
    return value.toFixed(2)
  }

  // Pre-deployment view
  if (CONTRACT_ADDRESSES.donutamagotchiToken === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl p-4 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-black mb-2 text-center">🍩 TOKEN NOT YET DEPLOYED</h2>
          <p className="text-xs font-bold text-pink-100 text-center">
            The $DONUTAMAGOTCHI token will be deployed soon. Here&apos;s how it will work:
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-sm mb-3 text-center text-black">📊 FEE SHARE SYSTEM</h3>

          <div className="space-y-3">
            <div className="bg-blue-100 rounded-lg p-3 border-2 border-black">
              <div className="font-black text-xs text-blue-800 mb-2">How You Earn</div>
              <div className="text-[10px] text-blue-700 font-bold space-y-1">
                <p>1. Each time someone feeds a donut, 5% goes to app fees</p>
                <p>2. 40% of that goes to the staker pool</p>
                <p>3. You claim your share based on how much you&apos;ve staked</p>
              </div>
            </div>

            <div className="bg-green-100 rounded-lg p-3 border-2 border-black">
              <div className="font-black text-xs text-green-800 mb-2">DPS Boost</div>
              <div className="text-[10px] text-green-700 font-bold">
                Stake 1M+ $DONUTAMAGOTCHI to get a 10% boost to your $DONUT earnings when you own the donut!
              </div>
            </div>

            <div className="bg-yellow-100 rounded-lg p-3 border-2 border-black">
              <div className="font-black text-xs text-yellow-800 mb-2">Fee Flow</div>
              <pre className="text-[9px] text-yellow-700 font-mono font-bold">
                {`5% App Fee (from feeding)
├── 60% → Operations
└── 40% → Staker Pool (YOU!)`}
              </pre>
            </div>
          </div>
        </div>

        {/* LP Info */}
        <div className="bg-purple-100 rounded-xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-sm mb-2 text-center">💧 LIQUIDITY</h3>
          <p className="text-[10px] text-purple-700 font-bold text-center">
            The primary LP will be <strong>$DONUT / $DONUTAMAGOTCHI</strong>, directly linking the two tokens.
            This means success in one drives demand for the other!
          </p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl p-4 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-sm font-black mb-2 text-black">🔗 CONNECT WALLET TO VIEW</h3>
        <p className="text-xs text-black/70 font-bold">
          Connect your wallet to see staking data and your pending rewards
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 rounded-xl p-4 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-xs text-red-700 font-bold">⚠️ Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl p-4 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-lg font-black mb-2 text-center">🍩 STAKING DASHBOARD</h2>
        <p className="text-xs font-bold text-pink-100 text-center">
          Stake $DONUTAMAGOTCHI to earn ETH from app fees
        </p>
      </div>

      {/* User Stats */}
      {userStaking && (
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-green-100 rounded-xl p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] text-green-600 mb-1 font-bold">Your Staked</div>
            <div className="text-xl font-black text-green-800">
              {formatTokens(userStaking.staked)}
            </div>
          </div>

          <div className="bg-yellow-100 rounded-xl p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] text-yellow-600 mb-1 font-bold">Pending ETH</div>
            <div className="text-xl font-black text-yellow-800">
              {formatEther(userStaking.pending)} Ξ
            </div>
          </div>

          <div className={`rounded-xl p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${userStaking.hasDpsBoost ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
            <div className="text-[10px] text-gray-600 mb-1 font-bold">DPS Boost</div>
            <div className={`text-xl font-black ${userStaking.hasDpsBoost ? 'text-purple-800' : 'text-gray-400'
              }`}>
              {userStaking.hasDpsBoost ? '✨ +10%' : '🔒 Need 1M'}
            </div>
          </div>
        </div>
      )}

      {/* Global Stats */}
      {stakingData && (
        <div className="bg-white rounded-xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-sm mb-3 text-center">📊 GLOBAL STAKING STATS</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-gray-600 mb-1 font-bold">Total Staked</div>
              <div className="text-sm font-black text-black">
                {formatTokens(stakingData.totalStaked)} $DONUTAMAGOTCHI
              </div>
            </div>

            <div>
              <div className="text-[10px] text-gray-600 mb-1 font-bold">Fee Pool</div>
              <div className="text-sm font-black text-green-600">
                {formatEther(stakingData.feePool)} ETH
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-blue-50 rounded-xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-sm mb-2 text-center">💡 HOW FEE SHARE WORKS</h3>
        <div className="text-[10px] space-y-1 text-blue-700 font-bold">
          <p>• <strong>40%</strong> of the 5% app fee goes to stakers</p>
          <p>• Claim your share anytime with <code className="bg-blue-200 px-1 rounded text-[9px]">claimFees()</code></p>
          <p>• Stake <strong>1M+ tokens</strong> for 10% DPS boost</p>
          <p>• More feeding activity = more rewards for everyone</p>
        </div>
      </div>

      {/* Verification */}
      <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-200">
        <p className="text-[9px] text-gray-500 text-center font-bold">
          All data is read directly from the blockchain. Verify on{' '}
          <a
            href={`https://basescan.org/address/${CONTRACT_ADDRESSES.donutamagotchiToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            BaseScan
          </a>
        </p>
      </div>
    </div>
  )
}