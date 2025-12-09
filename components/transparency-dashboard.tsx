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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl p-6 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-2">🍩 Token Not Yet Deployed</h2>
          <p className="text-pink-100">
            The $DONUTAMAGOTCHI token will be deployed soon. Here&apos;s how it will work:
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-lg mb-4">📊 Fee Share System</h3>

          <div className="space-y-4">
            <div className="bg-blue-100 rounded-lg p-4 border-2 border-black">
              <div className="font-black text-blue-800 mb-2">How You Earn</div>
              <div className="text-sm text-blue-700">
                <p>1. Each time someone feeds a donut, 5% goes to app fees</p>
                <p>2. 40% of that goes to the staker pool</p>
                <p>3. You claim your share based on how much you&apos;ve staked</p>
              </div>
            </div>

            <div className="bg-green-100 rounded-lg p-4 border-2 border-black">
              <div className="font-black text-green-800 mb-2">DPS Boost</div>
              <div className="text-sm text-green-700">
                Stake 1M+ $DONUTAMAGOTCHI to get a 10% boost to your $DONUT earnings when you own the donut!
              </div>
            </div>

            <div className="bg-yellow-100 rounded-lg p-4 border-2 border-black">
              <div className="font-black text-yellow-800 mb-2">Fee Flow</div>
              <pre className="text-xs text-yellow-700 font-mono">
                {`5% App Fee (from feeding)
├── 60% → Operations
└── 40% → Staker Pool (YOU!)`}
              </pre>
            </div>
          </div>
        </div>

        {/* LP Info */}
        <div className="bg-purple-100 rounded-xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-lg mb-2">💧 Liquidity</h3>
          <p className="text-sm text-purple-700">
            The primary LP will be <strong>$DONUT / $DONUTAMAGOTCHI</strong>, directly linking the two tokens.
            This means success in one drives demand for the other!
          </p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black mb-2">🔗 Connect Wallet to View</h3>
        <p className="text-gray-600">
          Connect your wallet to see staking data and your pending rewards
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 rounded-xl p-6 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-red-700 font-bold">⚠️ Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl p-6 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black mb-2">🍩 Staking Dashboard</h2>
        <p className="text-pink-100">
          Stake $DONUTAMAGOTCHI to earn ETH from app fees
        </p>
      </div>

      {/* User Stats */}
      {userStaking && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 rounded-xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-sm text-green-600 mb-1">Your Staked</div>
            <div className="text-2xl font-black text-green-800">
              {formatTokens(userStaking.staked)}
            </div>
          </div>

          <div className="bg-yellow-100 rounded-xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-sm text-yellow-600 mb-1">Pending ETH</div>
            <div className="text-2xl font-black text-yellow-800">
              {formatEther(userStaking.pending)} Ξ
            </div>
          </div>

          <div className={`rounded-xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${userStaking.hasDpsBoost ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
            <div className="text-sm text-gray-600 mb-1">DPS Boost</div>
            <div className={`text-2xl font-black ${userStaking.hasDpsBoost ? 'text-purple-800' : 'text-gray-400'
              }`}>
              {userStaking.hasDpsBoost ? '✨ +10%' : '🔒 Need 1M'}
            </div>
          </div>
        </div>
      )}

      {/* Global Stats */}
      {stakingData && (
        <div className="bg-white rounded-xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-lg mb-4">📊 Global Staking Stats</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Staked</div>
              <div className="text-xl font-black">
                {formatTokens(stakingData.totalStaked)} $DONUTAMAGOTCHI
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Fee Pool</div>
              <div className="text-xl font-black text-green-600">
                {formatEther(stakingData.feePool)} ETH
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-blue-50 rounded-xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-lg mb-3">💡 How Fee Share Works</h3>
        <div className="text-sm space-y-2 text-blue-700">
          <p>• <strong>40%</strong> of the 5% app fee goes to stakers</p>
          <p>• Claim your share anytime with <code className="bg-blue-200 px-1 rounded">claimFees()</code></p>
          <p>• Stake <strong>1M+ tokens</strong> for 10% DPS boost</p>
          <p>• More feeding activity = more rewards for everyone</p>
        </div>
      </div>

      {/* Verification */}
      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
        <p className="text-xs text-gray-500 text-center">
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
