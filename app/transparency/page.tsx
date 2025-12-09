import { TransparencyDashboard } from '@/components/transparency-dashboard'

export const metadata = {
  title: 'Ecosystem Transparency | Donutamagotchi',
  description:
    'Real-time proof of Donutamagotchi ecosystem contribution. See how we lock LP, burn tokens, and strengthen $DONUT.',
}

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🌍 Ecosystem Transparency
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Donutamagotchi is built on trust and community alignment. Every transaction is
            transparent and verifiable on-chain.
          </p>
        </div>

        <TransparencyDashboard />

        {/* FAQ Section */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ❓ Why This Matters
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
                Why this transparency matters
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The $DONUT community has seen projects come and go. We believe the strongest projects
                are built on aligned incentives and transparent mechanics. When your project succeeds
                because the ecosystem succeeds, everyone wins.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
                Our approach to ecosystem alignment
              </h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  ✅ <strong>25% of cosmetics revenue locked in $DONUT-WETH LP</strong> (permanent
                  liquidity, burned to dead address)
                </li>
                <li>
                  ✅ <strong>30% of cosmetics burned</strong> (deflation that benefits all holders)
                </li>
                <li>
                  ✅ <strong>7.5% team vesting over 12 months</strong> (sustainable incentives,
                  gradual unlock)
                </li>
                <li>
                  ✅ <strong>Transparent treasury</strong> (all allocations auditable on-chain)
                </li>
                <li>
                  ✅ <strong>Active community engagement</strong> (regular updates in builders chat,
                  public decisions)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
                Can I verify this?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Yes. Everything is on-chain and auditable:
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                <li>
                  • Call <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1">
                    getCosmeticsBreakdown()
                  </code>{' '}
                  on the token contract
                </li>
                <li>
                  • Check the <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1">
                    lpLockAddress
                  </code>{' '}
                  balance on Etherscan
                </li>
                <li>
                  • View burned LP tokens on Uniswap (sent to dead address 0x000...000)
                </li>
                <li>• See all transactions on Base Etherscan</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
                When is this enforced?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                From day 1. The smart contract automatically enforces these splits when cosmetics
                revenue is processed. There&apos;s no way to change the percentages without
                deploying a new contract (which would be immediately flagged by the community).
              </p>
            </div>
          </div>
        </div>

        {/* Community Commitment */}
        <div className="mt-12 bg-green-50 dark:bg-green-900 rounded-lg p-8 border-l-4 border-green-500">
          <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">
            🤝 Our Commitment
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Donutamagotchi is built <strong>with</strong> the $DONUT ecosystem, not on top of it.
            We succeed when $DONUT succeeds. Every action we take is designed to strengthen the
            ecosystem, not extract value.
          </p>
          <p className="text-green-700 dark:text-green-300">
            If you ever see us deviating from these principles, call us out in the builders chat.
            This commitment is permanent.
          </p>
        </div>
      </div>
    </main>
  )
}
