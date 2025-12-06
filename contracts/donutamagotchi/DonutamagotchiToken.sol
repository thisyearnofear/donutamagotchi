// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DonutamagotchiToken ($DONUTAMAGOTCHI)
 * @dev ERC20 token for the Donutamagotchi ecosystem
 * 
 * Total Supply: 1 Billion tokens
 * Distribution:
 * - 70% (700M) to play-to-earn rewards
 * - 20% (200M) to treasury & cosmetics
 * - 10% (100M) to liquidity & staking
 * 
 * Key Mechanics:
 * - Mint via game events (oracle/backend submits proofs)
 * - Burn on cosmetics (30% of revenue)
 * - Burn on breeding (1000 tokens per breed)
 * - Stake for governance + yield (5% APY)
 * 
 * Economics:
 * - No presale or whitelist (fair launch)
 * - Daily mint cap (~2-5M tokens max)
 * - Deflationary through burns
 */

contract DonutamagotchiToken is ERC20, ERC20Burnable, Ownable {
    // ============ Constants ============
    uint256 constant TOTAL_SUPPLY = 1_000_000_000e18; // 1 Billion with 18 decimals
    uint256 constant MAX_DAILY_MINT = 5_000_000e18;   // 5M tokens per day max
    
    // Allocation caps
    uint256 constant PLAYTOLEARN_CAP = 700_000_000e18;  // 70%
    uint256 constant TREASURY_CAP = 200_000_000e18;     // 20%
    uint256 constant LIQUIDITY_CAP = 100_000_000e18;    // 10%

    // ============ State ============
    address public minter;
    address public cosmneticsVault;
    address public treasuryAddress;
    
    uint256 public totalPlayToEarnMinted = 0;
    uint256 public totalTreasuryMinted = 0;
    uint256 public totalLiquidityMinted = 0;
    
    // Daily mint tracking
    uint256 public lastMintDay = 0;
    uint256 public dailyMintedThisDay = 0;
    
    // Staking for governance
    mapping(address => uint256) public stakedBalance;
    uint256 public totalStaked = 0;
    uint256 constant STAKING_APY = 5; // 5% annual yield
    mapping(address => uint256) public lastStakingReward;

    // ============ Events ============
    event MinterUpdated(address indexed newMinter);
    event VaultUpdated(address indexed newVault);
    event TokensMinted(address indexed to, uint256 amount, string indexed reason);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event StakingRewardClaimed(address indexed user, uint256 amount);

    // ============ Constructor ============
    constructor(
        address _minter,
        address _cosmneticsVault,
        address _treasuryAddress
    ) ERC20("Donutamagotchi", "DONUTAMAGOTCHI") Ownable(msg.sender) {
        require(_minter != address(0), "Invalid minter");
        require(_cosmneticsVault != address(0), "Invalid cosmetics vault");
        require(_treasuryAddress != address(0), "Invalid treasury");
        
        minter = _minter;
        cosmneticsVault = _cosmneticsVault;
        treasuryAddress = _treasuryAddress;
    }

    // ============ Minting (Play-to-Earn) ============
    /**
     * @dev Mint tokens for play-to-earn activities
     * Called by oracle/backend with proofs of game events
     * 
     * Events:
     * - "daily_login": +10 tokens
     * - "pet_interaction": +5 tokens
     * - "feeding_bonus": +10 tokens
     * - "donut_explorer": +10 tokens (discovery)
     * - "breeding": +25 tokens
     */
    function mintPlayToEarn(
        address to,
        uint256 amount,
        string calldata reason
    ) external {
        require(msg.sender == minter, "Only minter can call");
        require(to != address(0), "Invalid recipient");
        
        // Check daily cap
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay != lastMintDay) {
            lastMintDay = currentDay;
            dailyMintedThisDay = 0;
        }
        
        require(dailyMintedThisDay + amount <= MAX_DAILY_MINT, "Daily mint limit exceeded");
        require(totalPlayToEarnMinted + amount <= PLAYTOLEARN_CAP, "Play-to-earn cap exceeded");
        
        dailyMintedThisDay += amount;
        totalPlayToEarnMinted += amount;
        
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Mint to treasury from cosmetics revenue
     * Only called during cosmetics shop transactions
     */
    function mintTreasury(uint256 amount) external onlyOwner {
        require(totalTreasuryMinted + amount <= TREASURY_CAP, "Treasury cap exceeded");
        totalTreasuryMinted += amount;
        
        _mint(treasuryAddress, amount);
        emit TokensMinted(treasuryAddress, amount, "treasury");
    }

    /**
     * @dev Mint liquidity pool rewards
     */
    function mintLiquidity(address to, uint256 amount) external onlyOwner {
        require(totalLiquidityMinted + amount <= LIQUIDITY_CAP, "Liquidity cap exceeded");
        totalLiquidityMinted += amount;
        
        _mint(to, amount);
        emit TokensMinted(to, amount, "liquidity");
    }

    // ============ Cosmetics Revenue Burning ============
    /**
     * @dev Burn tokens from cosmetics sales (30% of cosmetics revenue)
     * Reduces circulating supply, benefits long-term holders
     * 
     * Called by cosmetics shop when purchases occur:
     * 1. 30% burned (deflation)
     * 2. 70% to treasury (operations)
     */
    function burnCosmetics(uint256 amount) external {
        require(msg.sender == cosmneticsVault || msg.sender == owner(), "Only vault or owner");
        burn(amount);
    }

    // ============ Staking & Governance ============
    /**
     * @dev Stake tokens for 5% APY + governance voting rights
     * Minimum stake: 10M tokens for governance participation
     */
    function stake(uint256 amount) external {
        require(amount > 0, "Stake amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens to this contract (they remain yours, just locked)
        transferFrom(msg.sender, address(this), amount);
        
        stakedBalance[msg.sender] += amount;
        totalStaked += amount;
        lastStakingReward[msg.sender] = block.timestamp;
        
        emit TokensStaked(msg.sender, amount);
    }

    /**
     * @dev Unstake tokens
     */
    function unstake(uint256 amount) external {
        require(amount > 0, "Unstake amount must be > 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        
        // Claim pending rewards first
        claimStakingReward();
        
        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        
        transfer(msg.sender, amount);
        emit TokensUnstaked(msg.sender, amount);
    }

    /**
     * @dev Calculate staking reward (5% APY)
     */
    function calculateStakingReward(address user) public view returns (uint256) {
        uint256 staked = stakedBalance[user];
        if (staked == 0) return 0;
        
        uint256 secondsStaked = block.timestamp - lastStakingReward[user];
        // 5% APY = 5/100/365 per day = 0.000136986% per day
        // Simplified: (staked * 5 * secondsStaked) / (100 * 365 days)
        return (staked * 5 * secondsStaked) / (100 * 365 days);
    }

    /**
     * @dev Claim accumulated staking rewards
     */
    function claimStakingReward() public {
        uint256 reward = calculateStakingReward(msg.sender);
        if (reward == 0) return;
        
        require(totalPlayToEarnMinted + reward <= PLAYTOLEARN_CAP, "Cap exceeded");
        
        totalPlayToEarnMinted += reward;
        lastStakingReward[msg.sender] = block.timestamp;
        
        _mint(msg.sender, reward);
        emit StakingRewardClaimed(msg.sender, reward);
    }

    /**
     * @dev Check if user can vote on cosmetics governance
     * Requirement: 10M+ tokens staked
     */
    function canVote(address user) external view returns (bool) {
        return stakedBalance[user] >= 10_000_000e18;
    }

    // ============ Admin Functions ============
    /**
     * @dev Update minter address (if moving oracle)
     */
    function setMinter(address newMinter) external onlyOwner {
        require(newMinter != address(0), "Invalid address");
        minter = newMinter;
        emit MinterUpdated(newMinter);
    }

    /**
     * @dev Update cosmetics vault address
     */
    function setVault(address newVault) external onlyOwner {
        require(newVault != address(0), "Invalid address");
        cosmneticsVault = newVault;
        emit VaultUpdated(newVault);
    }

    // ============ View Functions ============
    /**
     * @dev Get total circulating supply (accounts for burns)
     */
    function getCirculatingSupply() external view returns (uint256) {
        return totalSupply();
    }

    /**
     * @dev Get minted breakdown
     */
    function getMintedBreakdown() external view returns (
        uint256 playToEarn,
        uint256 treasury,
        uint256 liquidity,
        uint256 totalMinted
    ) {
        playToEarn = totalPlayToEarnMinted;
        treasury = totalTreasuryMinted;
        liquidity = totalLiquidityMinted;
        totalMinted = playToEarn + treasury + liquidity;
    }

    /**
     * @dev Get user's staking info
     */
    function getStakingInfo(address user) external view returns (
        uint256 staked,
        uint256 pendingReward,
        bool canVote,
        uint256 apy
    ) {
        staked = stakedBalance[user];
        pendingReward = calculateStakingReward(user);
        canVote = staked >= 10_000_000e18;
        apy = STAKING_APY;
    }
}
