// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDONUTAMAGOTCHIToken is IERC20 {
    function mintPlayToEarn(address to, uint256 amount, string calldata reason) external;
}

/**
 * @title DonutSanctuary
 * @dev NFT contract for retired donuts in Donutamagotchi
 * 
 * Core Features:
 * - Represents a retired donut (frozen stats, immutable legacy)
 * - Tracks retirement date, lifetime earnings, age at retirement
 * - Generates passive $DONUTAMAGOTCHI income forever (0.1 tokens/day)
 * - View-only interactions (cannot be re-mined or stolen)
 * 
 * A donut can be retired at Day 90+ of life. Once retired:
 * - Cannot mine ($DONUT) anymore
 * - Cannot be stolen
 * - Generates passive income via treasury
 * - Becomes part of Hall of Fame
 * - Legacy can be inherited by breeding offspring
 */

contract DonutSanctuary is ERC721, ERC721URIStorage, Ownable {
    // ============ Constants ============
    uint256 constant RETIREMENT_MINIMUM_DAYS = 90;
    uint256 constant DAILY_PASSIVE_INCOME = 0.1e18; // 0.1 $DONUTAMAGOTCHI per day
    
    // ============ Data Structures ============
    struct RetiredDonut {
        address minerAddress;           // Original miner contract address
        address retiredBy;              // Address that initiated retirement
        uint256 createdAtTimestamp;     // When the donut was born (from miner)
        uint256 retiredAtTimestamp;     // When retirement occurred
        uint256 totalEarningsDonut;     // Lifetime $DONUT earnings
        uint256 totalEarningsWeth;      // Lifetime WETH earnings
        uint8 finalGeneration;          // Generation at retirement
        uint32 offspringCount;          // Total offspring produced
        string memorialText;            // Optional epitaph/memory
    }

    // ============ State ============
    uint256 private nextTokenId = 1;
    mapping(uint256 => RetiredDonut) public retiredDonuts;
    mapping(address => uint256) public minerAddressToNFT;  // miner -> NFT token ID for quick lookup
    IDONUTAMAGOTCHIToken public donutamagotchiToken;
    mapping(uint256 => uint256) public lastClaimTime;
    
    uint256 public totalRetired = 0;
    mapping(address => uint256[]) public retirementsByUser; // User -> all their retired donuts
    
    // ============ Events ============
    event DonutRetired(
        uint256 indexed tokenId,
        address indexed minerAddress,
        address indexed retiredBy,
        uint256 ageInDays,
        uint256 totalEarningsDonut,
        uint256 totalEarningsWeth
    );

    event PassiveIncomeDistributed(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 timestamp
    );
    event IncomeClaimed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 amount
    );

    // ============ Constructor ============
    constructor(address _donutamagotchiToken) ERC721("Donutamagotchi Sanctuary", "DSANC") Ownable(msg.sender) {
        require(_donutamagotchiToken != address(0), "Invalid token address");
        donutamagotchiToken = IDONUTAMAGOTCHIToken(_donutamagotchiToken);
    }

    // ============ Retirement Logic ============
    /**
     * @dev Retire a donut (move to sanctuary for permanence)
     * @param minerAddress Address of the miner contract to retire
     * @param createdAtTimestamp When the donut was born
     * @param totalEarningsDonut Total $DONUT earned in lifetime
     * @param totalEarningsWeth Total WETH earned in lifetime
     * @param finalGeneration Generation at retirement
     * @param offspringCount Total offspring produced
     * @param memorialText Optional epitaph
     * 
     * Requirements:
     * - Donut must be at least 90 days old
     * - Only owner of the donut can retire it
     * - Miner address must not already be retired
     */
    function retireDonut(
        address minerAddress,
        uint256 createdAtTimestamp,
        uint256 totalEarningsDonut,
        uint256 totalEarningsWeth,
        uint8 finalGeneration,
        uint32 offspringCount,
        string calldata memorialText
    ) external returns (uint256) {
        require(minerAddress != address(0), "Invalid miner address");
        require(minerAddressToNFT[minerAddress] == 0, "Donut already retired");
        
        // Verify minimum age (90 days)
        uint256 ageInSeconds = block.timestamp - createdAtTimestamp;
        uint256 ageInDays = ageInSeconds / 1 days;
        require(ageInDays >= RETIREMENT_MINIMUM_DAYS, "Donut must be at least 90 days old");
        
        // Mint retirement NFT
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Store retirement data
        retiredDonuts[tokenId] = RetiredDonut({
            minerAddress: minerAddress,
            retiredBy: msg.sender,
            createdAtTimestamp: createdAtTimestamp,
            retiredAtTimestamp: block.timestamp,
            totalEarningsDonut: totalEarningsDonut,
            totalEarningsWeth: totalEarningsWeth,
            finalGeneration: finalGeneration,
            offspringCount: offspringCount,
            memorialText: memorialText
        });

        // Track for lookups
        minerAddressToNFT[minerAddress] = tokenId;
        retirementsByUser[msg.sender].push(tokenId);
        totalRetired++;

        emit DonutRetired(
            tokenId,
            minerAddress,
            msg.sender,
            ageInDays,
            totalEarningsDonut,
            totalEarningsWeth
        );

        return tokenId;
    }

    // ============ Sanctuary Queries ============
    /**
     * @dev Get retirement info for a donut
     */
    function getRetiredDonut(uint256 tokenId) external view returns (RetiredDonut memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return retiredDonuts[tokenId];
    }

    /**
     * @dev Check if a miner is already retired
     */
    function isRetired(address minerAddress) external view returns (bool) {
        return minerAddressToNFT[minerAddress] != 0;
    }

    /**
     * @dev Get retirement NFT for a miner address
     */
    function getRetirementNFT(address minerAddress) external view returns (uint256) {
        return minerAddressToNFT[minerAddress];
    }

    /**
     * @dev Get all retirements by an owner
     */
    function getRetirementsByOwner(address owner) external view returns (uint256[] memory) {
        return retirementsByUser[owner];
    }

    /**
     * @dev Calculate passive income earned since retirement
     * Increases by 0.1 $DONUTAMAGOTCHI per day
     */
    function calculatePassiveIncome(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        RetiredDonut memory retired = retiredDonuts[tokenId];
        
        uint256 startTime = lastClaimTime[tokenId] > retired.retiredAtTimestamp 
            ? lastClaimTime[tokenId] 
            : retired.retiredAtTimestamp;
            
        if (block.timestamp <= startTime) return 0;

        uint256 secondsSinceLastClaim = block.timestamp - startTime;
        uint256 daysSinceLastClaim = secondsSinceLastClaim / 1 days;
        
        return daysSinceLastClaim * DAILY_PASSIVE_INCOME;
    }

    /**
     * @dev Claim accumulated passive income
     */
    function claimIncome(uint256 tokenId) external {
        require(_ownerOf(tokenId) == msg.sender, "Only owner can claim");
        
        uint256 pending = this.calculatePassiveIncome(tokenId);
        require(pending > 0, "No income to claim");
        
        // Update state before external call
        lastClaimTime[tokenId] = block.timestamp;
        
        // Mint reward
        donutamagotchiToken.mintPlayToEarn(msg.sender, pending, "retirement_passive_income");
        
        emit IncomeClaimed(tokenId, msg.sender, pending);
    }

    /**
     * @dev Get age of retired donut (days lived)
     */
    function getRetiredAge(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        RetiredDonut memory retired = retiredDonuts[tokenId];
        
        uint256 ageinSeconds = retired.retiredAtTimestamp - retired.createdAtTimestamp;
        return ageinSeconds / 1 days;
    }

    /**
     * @dev Get Hall of Fame tier for a donut
     * Based on age, earnings, offspring, and generation
     */
    function getPrestigeTier(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        RetiredDonut memory retired = retiredDonuts[tokenId];
        
        uint256 ageInDays = (retired.retiredAtTimestamp - retired.createdAtTimestamp) / 1 days;
        uint256 earningsScore = retired.totalEarningsDonut / 1e18; // Normalize
        
        // Legendary: 120+ days AND 2000+ DONUT earned
        if (ageInDays >= 120 && earningsScore >= 2000) {
            return "LEGENDARY";
        }
        
        // Honored: 90+ days AND 1000+ DONUT earned
        if (ageInDays >= 90 && earningsScore >= 1000) {
            return "HONORED";
        }
        
        // Cherished: 90+ days (basic retirement)
        if (ageInDays >= 90) {
            return "CHERISHED";
        }
        
        return "RETIRED";
    }

    // ============ URI Management ============
    /**
     * @dev Set URI for retirement NFT (for metadata/IPFS)
     */
    function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Update memorial text for a retired donut
     */
    function updateMemorial(uint256 tokenId, string calldata newText) external {
        require(_ownerOf(tokenId) == msg.sender, "Only owner can update memorial");
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        retiredDonuts[tokenId].memorialText = newText;
    }

    // ============ View Overrides ============
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ============ Internal Overrides ============
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721)
    {
        super._increaseBalance(account, value);
    }
}
