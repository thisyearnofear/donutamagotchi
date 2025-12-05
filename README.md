# 🍩 Donutamagotchi

A virtual pet game where you care for a donut creature by feeding it with ETH and earn $DONUT tokens!

## 🎮 What is Donutamagotchi?

Donutamagotchi transforms the $DONUT mining protocol into a fun tamagotchi-style game. Your donut pet's happiness and health depend on how well you maintain it through the continuous Dutch auction mechanism.

## 🎯 How It Works

- **One Owner at a Time**: Only one person can own the pet at any moment
- **Feed to Own**: Pay ETH to become the owner and start earning
- **Price Dynamics**: Price doubles after each feed, then decays to 0 over one hour
- **Earn While You Own**: Accumulate $DONUT tokens as the current caretaker
- **Pet States**: Your pet's mood changes based on mining activity

## 💰 Economics

### Revenue Split
- 80% → Previous owner (profit opportunity!)
- 15% → Treasury (LP buyback & burn)
- 5% → App provider

### Emission Schedule
- Starts at 4 DONUT/sec
- Halves every 30 days
- Minimum 0.01 DONUT/sec (forever)

## 📊 Pet Stats

- **Health**: Time remaining before price decay
- **Happiness**: Current earning rate (DPS)
- **Energy**: Total donuts accumulated
- **Age**: Time as current owner

## 🎨 Pet States

- **Happy** 😊: High earning rate, well-fed
- **Excited** 🤩: Just fed or actively earning
- **Hungry** 😟: Price decaying, needs feeding
- **Sleeping** 😴: No active owner
- **Dead** 💀: Price fully decayed

## 🏗️ Built With

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS (pixel art aesthetic)
- Wagmi + Viem (Base network)
- Farcaster Miniapp SDK
- Canvas animations

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Smart Contracts

- **Network**: Base
- **DONUT Token**: `0xAE4a37d554C6D6F3E398546d8566B25052e0169C`
- **Miner Contract**: `0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6`
- **Multicall**: `0x3ec144554b484C6798A683E34c8e8E222293f323`

## 🎃 Kiroween Hackathon

This project was built for the Kiroween hackathon, demonstrating:
- Complete UI transformation (Costume Contest category)
- Preservation of all smart contract mechanics
- Tamagotchi-style game interface
- Pixel art aesthetic with retro gaming feel

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details
