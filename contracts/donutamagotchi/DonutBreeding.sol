// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title DonutBreeding
 * @dev NFT contract for tracking offspring genetics and pedigree in Donutamagotchi
 * 
 * Core Features:
 * - Offspring created from two parent donuts (tracked by miner address)
 * - Trait inheritance system (personality, color, earning potential)
 * - Generation tracking for pedigree
 * - Breeding cost burn mechanism (1000 $DONUTAMAGOTCHI per breed)
 * 
 * Note: Parents are referenced by their miner contract address (not NFT ID)
 * because donuts are tracked in the existing $DONUT mining protocol.
 */

interface IDONUTAMAGOTCHIToken is IERC20 {
    function burn(uint256 amount) external;
}

contract DonutBreeding is ERC721, ERC721URIStorage, Ownable {
    // ============ Constants ============
    uint256 constant BREEDING_COST = 1000e18; // 1000 $DONUTAMAGOTCHI tokens
    
    // ============ Data Structures ============
    struct Offspring {
        address parentAMiner;           // Miner address of parent A
        address parentBMiner;           // Miner address of parent B
        address owner;                  // Owner of offspring
        uint256 createdAt;              // Timestamp of breeding
        uint8 generation;               // Generation level
        string geneticData;             // Encoded trait data (JSON or compressed)
    }

    // ============ State ============
    IDONUTAMAGOTCHIToken public donutamagotchiToken;
    
    uint256 private nextTokenId = 1;
    mapping(uint256 => Offspring) public offspring;
    
    // Pedigree tracking
    mapping(address => uint256[]) public offspringByParent;      // All offspring for a parent miner
    mapping(address => uint256[]) public offspringByOwner;       // All offspring owned by an address
    mapping(address => uint256) public lastBreedingTime;         // Cooldown tracking (breed once per 7 days)
    
    // ============ Events ============
    event OffspringCreated(
        uint256 indexed tokenId,
        address indexed parentAMiner,
        address indexed parentBMiner,
        address owner,
        uint8 generation,
        string geneticData
    );

    event BreedingCooldownApplied(
        address indexed parentMiner,
        uint256 cooldownUntil
    );

    // ============ Constructor ============
    constructor(address _donutamagotchiToken) ERC721("Donutamagotchi Offspring", "DOFF") Ownable(msg.sender) {
        require(_donutamagotchiToken != address(0), "Invalid token address");
        donutamagotchiToken = IDONUTAMAGOTCHIToken(_donutamagotchiToken);
    }

    // ============ Core Breeding Logic ============
    /**
     * @dev Create offspring from two parent donuts
     * @param parentAMiner Address of parent A's miner contract
     * @param parentBMiner Address of parent B's miner contract
     * @param geneticData Encoded genetic information (JSON string with trait inheritance data)
     * 
     * Requirements:
     * - Both parents must be different addresses
     * - Caller must approve BREEDING_COST tokens
     * - Neither parent can have bred in the last 7 days
     */
    function breed(
        address parentAMiner,
        address parentBMiner,
        string calldata geneticData
    ) external returns (uint256) {
        require(parentAMiner != parentBMiner, "Parents must be different");
        require(parentAMiner != address(0) && parentBMiner != address(0), "Invalid parent address");
        require(bytes(geneticData).length > 0, "Genetic data required");
        
        // Check breeding cooldown (7 days = 604800 seconds)
        uint256 parentALastBreeding = lastBreedingTime[parentAMiner];
        uint256 parentBLastBreeding = lastBreedingTime[parentBMiner];
        uint256 currentTime = block.timestamp;
        
        require(
            parentALastBreeding == 0 || (currentTime - parentALastBreeding) >= 7 days,
            "Parent A on breeding cooldown"
        );
        require(
            parentBLastBreeding == 0 || (currentTime - parentBLastBreeding) >= 7 days,
            "Parent B on breeding cooldown"
        );

        // Burn breeding cost from caller
        require(
            donutamagotchiToken.transferFrom(msg.sender, address(this), BREEDING_COST),
            "Failed to transfer breeding cost"
        );
        donutamagotchiToken.burn(BREEDING_COST);

        // Calculate generation (max of parents + 1, default to 1 if both new)
        uint8 parentAGen = getMaxGenerationForMiner(parentAMiner);
        uint8 parentBGen = getMaxGenerationForMiner(parentBMiner);
        uint8 offspringGen = parentAGen > parentBGen ? parentAGen + 1 : parentBGen + 1;

        // Mint offspring NFT
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Store offspring metadata
        offspring[tokenId] = Offspring({
            parentAMiner: parentAMiner,
            parentBMiner: parentBMiner,
            owner: msg.sender,
            createdAt: currentTime,
            generation: offspringGen,
            geneticData: geneticData
        });

        // Track pedigree
        offspringByParent[parentAMiner].push(tokenId);
        offspringByParent[parentBMiner].push(tokenId);
        offspringByOwner[msg.sender].push(tokenId);

        // Apply breeding cooldown
        lastBreedingTime[parentAMiner] = currentTime;
        lastBreedingTime[parentBMiner] = currentTime;

        emit OffspringCreated(
            tokenId,
            parentAMiner,
            parentBMiner,
            msg.sender,
            offspringGen,
            geneticData
        );

        return tokenId;
    }

    // ============ Pedigree Queries ============
    /**
     * @dev Get all offspring for a parent miner
     */
    function getOffspringByParent(address parentMiner) external view returns (uint256[] memory) {
        return offspringByParent[parentMiner];
    }

    /**
     * @dev Get all offspring owned by an address
     */
    function getOffspringByOwner(address owner) external view returns (uint256[] memory) {
        return offspringByOwner[owner];
    }

    /**
     * @dev Get max generation reached by a miner (for calculating offspring gen)
     */
    function getMaxGenerationForMiner(address minerAddress) public view returns (uint8) {
        uint256[] memory minerOffspring = offspringByParent[minerAddress];
        if (minerOffspring.length == 0) return 0; // Not a parent yet
        
        uint8 maxGen = 0;
        for (uint256 i = 0; i < minerOffspring.length; i++) {
            if (offspring[minerOffspring[i]].generation > maxGen) {
                maxGen = offspring[minerOffspring[i]].generation;
            }
        }
        return maxGen;
    }

    /**
     * @dev Get pedigree info for an offspring
     */
    function getOffspring(uint256 tokenId) external view returns (Offspring memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return offspring[tokenId];
    }

    /**
     * @dev Get breeding cooldown remaining for a parent (0 if ready to breed)
     */
    function getBreedingCooldown(address parentMiner) external view returns (uint256) {
        uint256 lastBreeding = lastBreedingTime[parentMiner];
        if (lastBreeding == 0) return 0; // Never bred
        
        uint256 cooldownExpires = lastBreeding + 7 days;
        if (block.timestamp >= cooldownExpires) return 0; // Cooldown expired
        
        return cooldownExpires - block.timestamp;
    }

    /**
     * @dev Get family tree (ancestors) for an offspring
     * Returns parents' miners and their max generation
     */
    function getFamily(uint256 tokenId) external view returns (
        address parentA,
        address parentB,
        uint8 parentAGen,
        uint8 parentBGen,
        uint8 childGen
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        Offspring memory child = offspring[tokenId];
        
        return (
            child.parentAMiner,
            child.parentBMiner,
            getMaxGenerationForMiner(child.parentAMiner),
            getMaxGenerationForMiner(child.parentBMiner),
            child.generation
        );
    }

    // ============ URI Management ============
    /**
     * @dev Set URI for offspring NFT (for metadata/IPFS)
     */
    function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, uri);
    }

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
