export const CONTRACT_ADDRESSES = {
  // Core $DONUT protocol
  donut: "0xAE4a37d554C6D6F3E398546d8566B25052e0169C",
  miner: "0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6",
  multicall: "0x3ec144554b484C6798A683E34c8e8E222293f323",
  provider: "0xba366c82815983ff130c23ced78bd95e1f2c18ea",

  // $DONUTAMAGOTCHI ecosystem (deploy addresses TBD)
  donutamagotchiToken: process.env.NEXT_PUBLIC_DONUTAMAGOTCHI_TOKEN || "0x0000000000000000000000000000000000000000",
  donutBreeding: process.env.NEXT_PUBLIC_DONUT_BREEDING || "0x0000000000000000000000000000000000000000",
  donutSanctuary: process.env.NEXT_PUBLIC_DONUT_SANCTUARY || "0x0000000000000000000000000000000000000000",
} as const;

export const MULTICALL_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPrice",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "mine",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPaymentTokenAmount",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getMiner",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "epochId",
            type: "uint16",
          },
          {
            internalType: "uint192",
            name: "initPrice",
            type: "uint192",
          },
          {
            internalType: "uint40",
            name: "startTime",
            type: "uint40",
          },
          {
            internalType: "uint256",
            name: "glazed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dps",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nextDps",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "donutPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "miner",
            type: "address",
          },
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "ethBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "wethBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "donutBalance",
            type: "uint256",
          },
        ],
        internalType: "struct Multicall.MinerState",
        name: "state",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getAuction",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "epochId",
            type: "uint16",
          },
          {
            internalType: "uint192",
            name: "initPrice",
            type: "uint192",
          },
          {
            internalType: "uint40",
            name: "startTime",
            type: "uint40",
          },
          {
            internalType: "address",
            name: "paymentToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymentTokenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "wethAccumulated",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "wethBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymentTokenBalance",
            type: "uint256",
          },
        ],
        internalType: "struct Multicall.AuctionState",
        name: "state",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const BREEDING_ABI = [
  {
    name: "breed",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "parentAMiner", type: "address" },
      { name: "parentBMiner", type: "address" },
      { name: "geneticData", type: "string" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getOffspringByParent",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "parentMiner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "getOffspringByOwner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "getMaxGenerationForMiner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "minerAddress", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "getOffspring",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "parentAMiner", type: "address" },
          { name: "parentBMiner", type: "address" },
          { name: "owner", type: "address" },
          { name: "createdAt", type: "uint256" },
          { name: "generation", type: "uint8" },
          { name: "geneticData", type: "string" },
        ],
      },
    ],
  },
  {
    name: "getBreedingCooldown",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "parentMiner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getFamily",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "parentA", type: "address" },
      { name: "parentB", type: "address" },
      { name: "parentAGen", type: "uint8" },
      { name: "parentBGen", type: "uint8" },
      { name: "childGen", type: "uint8" },
    ],
  },
  {
    name: "OffspringCreated",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "parentAMiner", type: "address", indexed: true },
      { name: "parentBMiner", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: false },
      { name: "generation", type: "uint8", indexed: false },
      { name: "geneticData", type: "string", indexed: false },
    ],
  },
  {
    name: "nonces",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const DONUTAMAGOTCHI_TOKEN_ABI = [
  {
    name: "mintPlayToEarn",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "reason", type: "string" },
    ],
  },
  {
    name: "stake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
  },
  {
    name: "unstake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
  },
  {
    name: "claimStakingReward",
    type: "function",
    stateMutability: "nonpayable",
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "stakedBalance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "calculateStakingReward",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "canVote",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "TokensMinted",
    type: "event",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "reason", type: "string", indexed: true },
    ],
  },
  {
    name: "TokensStaked",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "StakingRewardClaimed",
    type: "event",
    inputs: [
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

export const SANCTUARY_ABI = [
  {
    name: "retireDonut",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "minerAddress", type: "address" },
      { name: "createdAtTimestamp", type: "uint256" },
      { name: "totalEarningsDonut", type: "uint256" },
      { name: "totalEarningsWeth", type: "uint256" },
      { name: "finalGeneration", type: "uint8" },
      { name: "offspringCount", type: "uint32" },
      { name: "memorialText", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "claimIncome",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    name: "calculatePassiveIncome",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getRetirementsByOwner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "getRetiredDonut",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "minerAddress", type: "address" },
          { name: "retiredBy", type: "address" },
          { name: "createdAtTimestamp", type: "uint256" },
          { name: "retiredAtTimestamp", type: "uint256" },
          { name: "totalEarningsDonut", type: "uint256" },
          { name: "totalEarningsWeth", type: "uint256" },
          { name: "finalGeneration", type: "uint8" },
          { name: "offspringCount", type: "uint32" },
          { name: "memorialText", type: "string" },
        ],
      },
    ],
  },
  {
    name: "getPrestigeTier",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
] as const;
