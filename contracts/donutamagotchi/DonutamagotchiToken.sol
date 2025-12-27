// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title DonutamagotchiToken ($DONUTAMAGOTCHI)
 * @dev Enhanced ERC20 token for the Donutamagotchi ecosystem
 * 
 * Core Features:
 * - Staking with ETH fee share (from 0xSplit)
 * - DPS boost for high stakers (1M+ tokens) → Applied to CARE REWARDS
 * - Care Streak system (daily engagement multipliers)
 * - Burn mechanics (cosmetics + breeding)
 * - On-chain cosmetics ownership
 * 
 * Design Principles:
 * - ALIGNED: More daily care = more rewards = more sticky
 * - DEFLATIONARY: Burn on cosmetics and breeding
 * - ENGAGING: Streak system rewards consistency
 */
contract DonutamagotchiToken is ERC20, ERC20Burnable, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Constants ============
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000e18; // 1 Billion
    uint256 public constant DPS_BOOST_THRESHOLD = 1_000_000e18; // 1M tokens
    uint256 public constant DPS_BOOST_PERCENT = 10; // 10% boost on care rewards
    uint256 public constant BREEDING_COST = 1_000e18; // 1000 tokens burned per breed
    
    // Streak thresholds and multipliers (100 = 1x, 125 = 1.25x, etc.)
    uint256 public constant STREAK_7_MULTIPLIER = 125;   // 1.25x at 7 days
    uint256 public constant STREAK_14_MULTIPLIER = 150;  // 1.5x at 14 days
    uint256 public constant STREAK_30_MULTIPLIER = 200;  // 2x at 30 days
    uint256 public constant STREAK_WINDOW = 36 hours;    // Max time between care actions

    // ============ State ============
    
    // Minting
    address public careSigner; // Backend signer for care rewards
    mapping(bytes32 => bool) public usedSignatures; // Prevent replay
    
    // Staking
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public lastClaimTime;
    uint256 public totalStaked;
    uint256 public feePool; // ETH accumulated for stakers
    uint256 public totalDistributed; // Track total ETH distributed
    
    // Care Streak System
    mapping(address => uint256) public lastCareTime;
    mapping(address => uint16) public careStreak;
    mapping(address => uint256) public totalCareRewards;
    mapping(address => uint256) public careActionsToday;
    mapping(address => uint256) public lastCareDay; // Track day number for daily reset
    
    // Cosmetics Ownership
    mapping(address => mapping(bytes32 => bool)) public ownedCosmetics;
    mapping(bytes32 => uint256) public cosmeticPrices; // Price per cosmetic ID
    uint256 public totalCosmeticsBurned;
    
    // ============ Events ============
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event FeesClaimed(address indexed user, uint256 amount);
    event FeeReceived(uint256 amount);
    event CareRewardMinted(address indexed user, uint256 baseAmount, uint256 finalAmount, string reason, uint16 newStreak);
    event BreedingBurn(address indexed user, uint256 amount);
    event StreakBroken(address indexed user, uint16 previousStreak);
    event StreakMilestone(address indexed user, uint16 streak, uint256 multiplier);
    event CosmeticPurchased(address indexed user, bytes32 indexed cosmeticId, uint256 cost);
    event CosmeticPriceSet(bytes32 indexed cosmeticId, uint256 price);

    // ============ Constructor ============
    constructor(
        address _careSigner,
        address _initialHolder
    ) ERC20("Donutamagotchi", "DONUTAMAGOTCHI") Ownable(msg.sender) {
        require(_careSigner != address(0), "Invalid signer");
        require(_initialHolder != address(0), "Invalid holder");
        
        careSigner = _careSigner;
        
        // Mint total supply to initial holder (for LP seeding + distribution)
        _mint(_initialHolder, TOTAL_SUPPLY);
    }

    // ============ Receive ETH (from 0xSplit) ============
    receive() external payable {
        feePool += msg.value;
        emit FeeReceived(msg.value);
    }

    // ============ Staking ============
    
    /**
     * @dev Stake tokens to earn fee share + care reward boost
     */
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim any pending rewards first
        _claimFees(msg.sender);
        
        // Transfer to contract
        _transfer(msg.sender, address(this), amount);
        
        stakedBalance[msg.sender] += amount;
        totalStaked += amount;
        lastClaimTime[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake tokens
     */
    function unstake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked");
        
        // Claim pending rewards first
        _claimFees(msg.sender);
        
        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        
        // Return tokens
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Claim accumulated ETH fee share
     */
    function claimFees() external {
        _claimFees(msg.sender);
    }

    function _claimFees(address user) internal {
        if (totalStaked == 0 || feePool == 0) return;
        if (stakedBalance[user] == 0) return;
        
        // Calculate user's share of the fee pool
        uint256 share = (feePool * stakedBalance[user]) / totalStaked;
        
        if (share > 0 && share <= address(this).balance) {
            feePool -= share;
            totalDistributed += share;
            lastClaimTime[user] = block.timestamp;
            
            (bool success, ) = user.call{value: share}("");
            require(success, "ETH transfer failed");
            
            emit FeesClaimed(user, share);
        }
    }

    /**
     * @dev View pending fee share for user
     */
    function pendingFees(address user) external view returns (uint256) {
        if (totalStaked == 0 || feePool == 0) return 0;
        return (feePool * stakedBalance[user]) / totalStaked;
    }

    /**
     * @dev Check if user has DPS boost (1M+ staked)
     */
    function hasDPSBoost(address user) external view returns (bool) {
        return stakedBalance[user] >= DPS_BOOST_THRESHOLD;
    }

    // ============ Care Streak System ============
    
    /**
     * @dev Get current care streak multiplier (100 = 1x)
     */
    function getCareMultiplier(address user) public view returns (uint256) {
        uint16 streak = careStreak[user];
        if (streak >= 30) return STREAK_30_MULTIPLIER;
        if (streak >= 14) return STREAK_14_MULTIPLIER;
        if (streak >= 7)  return STREAK_7_MULTIPLIER;
        return 100; // 1x base
    }
    
    /**
     * @dev Get full care info for user
     */
    function getCareInfo(address user) external view returns (
        uint16 streak,
        uint256 multiplier,
        uint256 totalRewards,
        uint256 lastCare,
        bool streakActive,
        uint256 actionsToday
    ) {
        streak = careStreak[user];
        multiplier = getCareMultiplier(user);
        totalRewards = totalCareRewards[user];
        lastCare = lastCareTime[user];
        streakActive = (lastCare > 0) && (block.timestamp - lastCare < STREAK_WINDOW);
        
        uint256 currentDay = block.timestamp / 1 days;
        actionsToday = (lastCareDay[user] == currentDay) ? careActionsToday[user] : 0;
    }

    // ============ Care Rewards (Backend-Signed) ============
    
    /**
     * @dev Mint care rewards with backend signature
     * Applies streak multiplier + DPS boost
     * @param to Recipient address
     * @param amount Base token amount (before multipliers)
     * @param reason Reason string (e.g., "feeding", "daily_checkin", "petting")
     * @param nonce Unique nonce to prevent replay
     * @param signature Backend signature
     */
    function mintCareReward(
        address to,
        uint256 amount,
        string calldata reason,
        uint256 nonce,
        bytes calldata signature
    ) external {
        // Create message hash
        bytes32 messageHash = keccak256(abi.encodePacked(to, amount, reason, nonce));
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        
        // Verify signature
        require(!usedSignatures[messageHash], "Signature already used");
        require(ethSignedHash.recover(signature) == careSigner, "Invalid signature");
        
        usedSignatures[messageHash] = true;
        
        // Update streak
        _updateStreak(to);
        
        // Calculate final amount with multipliers
        uint256 streakMultiplier = getCareMultiplier(to);
        uint256 finalAmount = (amount * streakMultiplier) / 100;
        
        // Apply DPS boost if staked 1M+
        if (stakedBalance[to] >= DPS_BOOST_THRESHOLD) {
            finalAmount = (finalAmount * (100 + DPS_BOOST_PERCENT)) / 100;
        }
        
        // Mint from contract's balance (must hold reserve)
        require(balanceOf(address(this)) >= finalAmount, "Insufficient reserve");
        _transfer(address(this), to, finalAmount);
        
        // Track rewards
        totalCareRewards[to] += finalAmount;
        
        // Track daily actions
        uint256 currentDay = block.timestamp / 1 days;
        if (lastCareDay[to] != currentDay) {
            careActionsToday[to] = 0;
            lastCareDay[to] = currentDay;
        }
        careActionsToday[to]++;
        
        emit CareRewardMinted(to, amount, finalAmount, reason, careStreak[to]);
    }
    
    /**
     * @dev Internal: Update care streak based on time since last care
     */
    function _updateStreak(address user) internal {
        uint256 timeSinceLastCare = block.timestamp - lastCareTime[user];
        uint16 previousStreak = careStreak[user];
        
        if (lastCareTime[user] == 0) {
            // First care action
            careStreak[user] = 1;
        } else if (timeSinceLastCare > STREAK_WINDOW) {
            // Streak broken - reset to 1
            careStreak[user] = 1;
            emit StreakBroken(user, previousStreak);
        } else if (timeSinceLastCare >= 20 hours) {
            // Enough time passed for new day - increment streak
            careStreak[user]++;
            
            // Check for milestone
            uint16 newStreak = careStreak[user];
            if (newStreak == 7 || newStreak == 14 || newStreak == 30) {
                emit StreakMilestone(user, newStreak, getCareMultiplier(user));
            }
        }
        // If < 20 hours, streak stays same (same day actions don't increment)
        
        lastCareTime[user] = block.timestamp;
    }

    // ============ Cosmetics ============
    
    /**
     * @dev Purchase a cosmetic (burns tokens)
     */
    function purchaseCosmetic(bytes32 cosmeticId) external {
        uint256 price = cosmeticPrices[cosmeticId];
        require(price > 0, "Cosmetic not available");
        require(!ownedCosmetics[msg.sender][cosmeticId], "Already owned");
        require(balanceOf(msg.sender) >= price, "Insufficient balance");
        
        _burn(msg.sender, price);
        ownedCosmetics[msg.sender][cosmeticId] = true;
        totalCosmeticsBurned += price;
        
        emit CosmeticPurchased(msg.sender, cosmeticId, price);
    }
    
    /**
     * @dev Check if user owns a cosmetic
     */
    function ownsCosmetic(address user, bytes32 cosmeticId) external view returns (bool) {
        return ownedCosmetics[user][cosmeticId];
    }
    
    /**
     * @dev Admin: Set cosmetic price
     */
    function setCosmeticPrice(bytes32 cosmeticId, uint256 price) external onlyOwner {
        cosmeticPrices[cosmeticId] = price;
        emit CosmeticPriceSet(cosmeticId, price);
    }

    // ============ Breeding Burn ============
    
    /**
     * @dev Burn tokens for breeding (called by breeding contract or user)
     */
    function burnForBreeding() external {
        _burn(msg.sender, BREEDING_COST);
        emit BreedingBurn(msg.sender, BREEDING_COST);
    }

    // ============ Admin ============
    
    /**
     * @dev Update care reward signer
     */
    function setCareSigner(address _signer) external onlyOwner {
        require(_signer != address(0), "Invalid signer");
        careSigner = _signer;
    }

    /**
     * @dev Emergency withdraw ETH (only if no stakers)
     */
    function emergencyWithdraw() external onlyOwner {
        require(totalStaked == 0, "Cannot withdraw with active stakers");
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    // ============ View Functions ============
    
    /**
     * @dev Get staking info for user
     */
    function getStakingInfo(address user) external view returns (
        uint256 staked,
        uint256 pending,
        bool hasDpsBoost,
        uint256 totalStakedGlobal,
        uint256 feePoolBalance
    ) {
        staked = stakedBalance[user];
        pending = this.pendingFees(user);
        hasDpsBoost = stakedBalance[user] >= DPS_BOOST_THRESHOLD;
        totalStakedGlobal = totalStaked;
        feePoolBalance = feePool;
    }
    
    /**
     * @dev Get comprehensive user stats
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 staked,
        uint16 careStreak_,
        uint256 careMultiplier,
        uint256 totalCareEarnings,
        bool hasDpsBoost,
        uint256 pendingFees_
    ) {
        balance = balanceOf(user);
        staked = stakedBalance[user];
        careStreak_ = careStreak[user];
        careMultiplier = getCareMultiplier(user);
        totalCareEarnings = totalCareRewards[user];
        hasDpsBoost = stakedBalance[user] >= DPS_BOOST_THRESHOLD;
        pendingFees_ = this.pendingFees(user);
    }
}

