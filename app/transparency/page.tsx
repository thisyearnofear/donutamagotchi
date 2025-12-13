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
              ON-CHAIN PROOF
            </p>
          </div>

          <TransparencyDashboard />

          {/* FAQ Section */}
          <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-3">
           
              <div>
              
                <ul className="text-xs text-black/80 font-bold space-y-1">
                  <li>✅ <strong>25%</strong> cosmetics revenue → $DONUT-WETH LP (locked, burned)</li>
                  <li>✅ <strong>30%</strong> cosmetics burned (deflation for all holders)</li>
                  <li>✅ <strong>7.5%</strong> team vesting over 12 months</li>
                </ul>
              </div>

            
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  )
}