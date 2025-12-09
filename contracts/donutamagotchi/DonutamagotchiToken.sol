// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title DonutamagotchiToken ($DONUTAMAGOTCHI)
 * @dev Simplified ERC20 token for the Donutamagotchi ecosystem
 * 
 * Core Features:
 * - Staking with ETH fee share (from 0xSplit)
 * - DPS boost for high stakers (1M+ tokens)
 * - Burn mechanics (cosmetics + breeding)
 * - Care rewards (backend-signed minting)
 * 
 * Design Principles:
 * - SIMPLE: ~150 lines, easy to audit
 * - ALIGNED: More $DONUT activity = more staker rewards
 * - DEFLATIONARY: Burn on cosmetics and breeding
 */
contract DonutamagotchiToken is ERC20, ERC20Burnable, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Constants ============
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000e18; // 1 Billion
    uint256 public constant DPS_BOOST_THRESHOLD = 1_000_000e18; // 1M tokens
    uint256 public constant DPS_BOOST_PERCENT = 10; // 10% boost
    uint256 public constant BREEDING_COST = 1_000e18; // 1000 tokens burned per breed

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
    
    // ============ Events ============
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event FeesClaimed(address indexed user, uint256 amount);
    event FeeReceived(uint256 amount);
    event CareRewardMinted(address indexed user, uint256 amount, string reason);
    event BreedingBurn(address indexed user, uint256 amount);

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
     * @dev Stake tokens to earn fee share + DPS boost
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

    // ============ Care Rewards (Backend-Signed) ============
    
    /**
     * @dev Mint care rewards with backend signature
     * @param to Recipient address
     * @param amount Token amount
     * @param reason Reason string (e.g., "feeding", "daily_checkin")
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
        
        // Mint from contract's balance (must hold reserve)
        require(balanceOf(address(this)) >= amount, "Insufficient reserve");
        _transfer(address(this), to, amount);
        
        emit CareRewardMinted(to, amount, reason);
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
}
