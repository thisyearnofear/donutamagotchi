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
    
    // Team Vesting: 7.5% over 12 months linear
    uint256 constant TEAM_ALLOCATION = 75_000_000e18;   // 7.5% of 1B
    uint256 constant VESTING_DURATION = 365 days;       // 12 months
    uint256 constant MONTHLY_RELEASE = TEAM_ALLOCATION / 12;  // ~0.625% per month
    
    // Community Alignment: LP Lock Percentages
    uint256 constant LP_LOCK_PERCENTAGE = 25;    // 25% of cosmetics → LP lock
    uint256 constant BURN_PERCENTAGE = 30;       // 30% of cosmetics → burn
    uint256 constant TREASURY_PERCENTAGE = 45;   // 45% of cosmetics → treasury

    // ============ State ============
    mapping(address => bool) public isMinter;
    address public cosmneticsVault;
    address public treasuryAddress;
    address public lpLockAddress;  // Dead address or timelock contract
    address public teamAddress;     // Team vesting recipient
    
    uint256 public totalPlayToEarnMinted = 0;
    uint256 public totalTreasuryMinted = 0;
    uint256 public totalLiquidityMinted = 0;
    
    // LP Lock Tracking (Community Transparency)
    uint256 public totalCosmeticsRevenue = 0;
    uint256 public totalLockedForLP = 0;
    uint256 public totalBurnedFromCosmetics = 0;
    
    // Team Vesting Tracking
    uint256 public vestingStartTime = 0;
    uint256 public teamAllocationClaimed = 0;
    
    // Daily mint tracking
    uint256 public lastMintDay = 0;
    uint256 public dailyMintedThisDay = 0;
    
    // Staking for governance
    mapping(address => uint256) public stakedBalance;
    uint256 public totalStaked = 0;
    uint256 constant STAKING_APY = 5; // 5% annual yield
    mapping(address => uint256) public lastStakingReward;

    // ============ Events ============
    event MinterStatusUpdated(address indexed minter, bool status);
    event VaultUpdated(address indexed newVault);
    event TokensMinted(address indexed to, uint256 amount, string indexed reason);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event StakingRewardClaimed(address indexed user, uint256 amount);
    event CosmeticsRevenueProcessed(uint256 totalRevenue, uint256 lockedForLP, uint256 burned, uint256 toTreasury);
    event LPLockAddressUpdated(address indexed newLPLockAddress);
    event TeamVestingInitialized(address indexed teamAddress, uint256 startTime);
    event TeamTokensClaimed(address indexed teamAddress, uint256 amount, uint256 totalClaimed);

    // ============ Constructor ============
    constructor(
        address _minter,
        address _cosmneticsVault,
        address _treasuryAddress,
        address _lpLockAddress,
        address _teamAddress
    ) ERC20("Donutamagotchi", "DONUTAMAGOTCHI") Ownable(msg.sender) {
        require(_minter != address(0), "Invalid minter");
        require(_cosmneticsVault != address(0), "Invalid cosmetics vault");
        require(_treasuryAddress != address(0), "Invalid treasury");
        require(_lpLockAddress != address(0), "Invalid LP lock address");
        require(_teamAddress != address(0), "Invalid team address");
        
        isMinter[_minter] = true;
        cosmneticsVault = _cosmneticsVault;
        treasuryAddress = _treasuryAddress;
        lpLockAddress = _lpLockAddress;
        teamAddress = _teamAddress;
        
        // Initialize team vesting (starts at deployment)
        vestingStartTime = block.timestamp;
        
        // Mint team allocation (locked via vesting)
        _mint(address(this), TEAM_ALLOCATION);
        
        emit TeamVestingInitialized(_teamAddress, block.timestamp);
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
        require(isMinter[msg.sender], "Only minter can call");
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

    // ============ Cosmetics Revenue Processing ============
    /**
     * @dev Process cosmetics revenue with community alignment splits
     * Called by cosmetics shop when purchases occur
     * 
     * Revenue allocation:
     * - 25% locked for $DONUT-WETH LP (verifiable burn of LP tokens)
     * - 30% burned (deflation, benefits holders)
     * - 45% to treasury (ecosystem operations, community rewards)
     * 
     * This ensures Donutamagotchi contributes back to $DONUT ecosystem
     * and prevents developer token dumps (unlike Donuette)
     */
    function processCosmeticsRevenue(uint256 amount) external {
        require(msg.sender == cosmneticsVault || msg.sender == owner(), "Only vault or owner");
        require(amount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Calculate splits
        uint256 lockForLP = (amount * LP_LOCK_PERCENTAGE) / 100;
        uint256 burnAmount = (amount * BURN_PERCENTAGE) / 100;
        uint256 treasuryAmount = (amount * TREASURY_PERCENTAGE) / 100;
        
        // Track for transparency
        totalCosmeticsRevenue += amount;
        totalLockedForLP += lockForLP;
        totalBurnedFromCosmetics += burnAmount;
        
        // 1. Transfer to LP lock address (permanent liquidity)
        transfer(lpLockAddress, lockForLP);
        
        // 2. Burn deflation amount
        transferFrom(msg.sender, address(this), burnAmount);
        burn(burnAmount);
        
        // 3. Transfer to treasury for ecosystem
        transferFrom(msg.sender, treasuryAddress, treasuryAmount);
        
        emit CosmeticsRevenueProcessed(amount, lockForLP, burnAmount, treasuryAmount);
    }

    /**
     * @dev Legacy function for backward compatibility (routes to processCosmeticsRevenue)
     */
    function burnCosmetics(uint256 amount) external {
        require(msg.sender == cosmneticsVault || msg.sender == owner(), "Only vault or owner");
        processCosmeticsRevenue(amount);
    }

    // ============ Team Vesting ============
    /**
     * @dev Claim vested team tokens (0.625% per month, linear over 12 months)
     * Only callable by team address
     * Tokens are released gradually to prevent large dumps
     */
    function claimTeamVesting() external {
        require(msg.sender == teamAddress, "Only team can claim vesting");
        require(vestingStartTime != 0, "Vesting not initialized");
        
        uint256 elapsedTime = block.timestamp - vestingStartTime;
        uint256 elapsedMonths = elapsedTime / 30 days;
        
        // Cap at 12 months (full vesting)
        if (elapsedMonths > 12) {
            elapsedMonths = 12;
        }
        
        uint256 totalVestableAmount = (MONTHLY_RELEASE * elapsedMonths);
        uint256 claimableAmount = totalVestableAmount - teamAllocationClaimed;
        
        require(claimableAmount > 0, "No tokens available to claim yet");
        require(balanceOf(address(this)) >= claimableAmount, "Insufficient contract balance");
        
        teamAllocationClaimed += claimableAmount;
        
        transfer(teamAddress, claimableAmount);
        emit TeamTokensClaimed(teamAddress, claimableAmount, teamAllocationClaimed);
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
     * @dev Update minter status (enable/disable)
     */
    function setMinterStatus(address minter, bool status) external onlyOwner {
        require(minter != address(0), "Invalid address");
        isMinter[minter] = status;
        emit MinterStatusUpdated(minter, status);
    }

    /**
     * @dev Update cosmetics vault address
     */
    function setVault(address newVault) external onlyOwner {
        require(newVault != address(0), "Invalid address");
        cosmneticsVault = newVault;
        emit VaultUpdated(newVault);
    }

    /**
     * @dev Update LP lock address (for rotating dead addresses or governance contracts)
     */
    function setLPLockAddress(address newLPLockAddress) external onlyOwner {
        require(newLPLockAddress != address(0), "Invalid LP lock address");
        lpLockAddress = newLPLockAddress;
        emit LPLockAddressUpdated(newLPLockAddress);
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

    // ============ Transparency & Community Info ============
    /**
     * @dev Get cosmetics revenue breakdown (for transparency dashboard)
     * Shows how protocol fees contribute to $DONUT ecosystem
     */
    function getCosmeticsBreakdown() external view returns (
        uint256 totalRevenue,
        uint256 lockedForLP,
        uint256 burned,
        uint256 toTreasury,
        uint256 lpLockPercentage,
        uint256 burnPercentage,
        uint256 treasuryPercentage
    ) {
        totalRevenue = totalCosmeticsRevenue;
        lockedForLP = totalLockedForLP;
        burned = totalBurnedFromCosmetics;
        toTreasury = totalRevenue - lockedForLP - burned; // Calculated from what's not locked/burned
        lpLockPercentage = LP_LOCK_PERCENTAGE;
        burnPercentage = BURN_PERCENTAGE;
        treasuryPercentage = TREASURY_PERCENTAGE;
    }

    /**
     * @dev Get team vesting information
     * Shows vesting progress, monthly release schedule, and claimed amount
     */
    function getTeamVestingInfo() external view returns (
        uint256 totalAllocation,
        uint256 claimed,
        uint256 remaining,
        uint256 monthlyRelease,
        uint256 elapsedMonths,
        uint256 vestingDuration,
        uint256 startTime,
        bool isFullyVested
    ) {
        totalAllocation = TEAM_ALLOCATION;
        claimed = teamAllocationClaimed;
        remaining = totalAllocation - claimed;
        monthlyRelease = MONTHLY_RELEASE;
        
        uint256 elapsedTime = block.timestamp - vestingStartTime;
        elapsedMonths = elapsedTime / 30 days;
        if (elapsedMonths > 12) {
            elapsedMonths = 12;
        }
        
        vestingDuration = VESTING_DURATION;
        startTime = vestingStartTime;
        isFullyVested = (block.timestamp - vestingStartTime) >= VESTING_DURATION;
    }
}
