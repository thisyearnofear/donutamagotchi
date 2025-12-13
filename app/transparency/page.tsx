import { TransparencyDashboard } from '@/components/transparency-dashboard'
import { NavBar } from '@/components/nav-bar'

export const metadata = {
  title: 'Ecosystem Transparency | Donutamagotchi',
  description:
    'Real-time proof of Donutamagotchi ecosystem contribution. See how we lock LP, burn tokens, and strengthen $DONUT.',
}

export default function TransparencyPage() {
  return (
    <main className="flex h-screen w-screen justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 font-mono text-white">
      <div
        className="relative flex h-full w-full max-w-[520px] flex-1 flex-col overflow-hidden px-3 pb-3"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        }}
      >
        <div className="flex flex-1 flex-col overflow-y-auto space-y-3">
          {/* Header */}
          <div className="bg-yellow-300 border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-2xl font-black text-center text-black tracking-tight">
              🌍 TRANSPARENCY
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              ON-CHAIN PROOF OF ECOSYSTEM ALIGNMENT
            </p>
          </div>

          <TransparencyDashboard />

          {/* FAQ Section */}
          <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-lg font-black mb-3 text-black text-center">
              ❓ WHY THIS MATTERS
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-black text-sm text-black mb-2">
                  Why this transparency matters
                </h3>
                <p className="text-xs text-black/80 font-bold">
                  The $DONUT community has seen projects come and go. We believe the strongest projects
                  are built on aligned incentives and transparent mechanics. When your project succeeds
                  because the ecosystem succeeds, everyone wins.
                </p>
              </div>

              <div>
                <h3 className="font-black text-sm text-black mb-2">
                  Our approach to ecosystem alignment
                </h3>
                <ul className="text-xs text-black/80 font-bold space-y-2">
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
                <h3 className="font-black text-sm text-black mb-2">
                  Can I verify this?
                </h3>
                <p className="text-xs text-black/80 font-bold mb-2">
                  Yes. Everything is on-chain and auditable:
                </p>
                <ul className="text-xs text-black/80 font-bold space-y-1">
                  <li>
                    • Call <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">
                      getCosmeticsBreakdown()
                    </code>{' '}
                    on the token contract
                  </li>
                  <li>
                    • Check the <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">
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
                <h3 className="font-black text-sm text-black mb-2">
                  When is this enforced?
                </h3>
                <p className="text-xs text-black/80 font-bold">
                  From day 1. The smart contract automatically enforces these splits when cosmetics
                  revenue is processed. There&apos;s no way to change the percentages without
                  deploying a new contract (which would be immediately flagged by the community).
                </p>
              </div>
            </div>
          </div>

          {/* Community Commitment */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-lg font-black mb-3 text-black text-center">
              🤝 OUR COMMITMENT
            </h2>
            <p className="text-xs text-black/80 font-bold mb-3">
              Donutamagotchi is built <strong>with</strong> the $DONUT ecosystem, not on top of it.
              We succeed when $DONUT succeeds. Every action we take is designed to strengthen the
              ecosystem, not extract value.
            </p>
            <p className="text-xs text-black/80 font-bold">
              If you ever see us deviating from these principles, call us out in the builders chat.
              This commitment is permanent.
            </p>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  )
}