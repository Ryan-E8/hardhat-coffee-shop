// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

error CoffeeNFT__NotCoffeeShop();

contract CoffeeNFT is ERC721, ERC721Burnable {
    event NftMinted(address indexed buyer, uint256 indexed tokenId);
    event NftBurned(address indexed holder, uint256 indexed tokenId);

    string public constant TOKEN_URI =
        "ipfs://QmSXVobWDAUuNgvwBKycSXFf2ZN1SXpVeH93p3TQTH1Xxs?filename=CoffeeReceipt.json";
    uint256 private s_tokenCounter;
    address private immutable i_coffeeShopAddress;

    ///////////////
    // Modifiers //
    ///////////////

    modifier onlyCoffeeShop() {
        if (msg.sender != i_coffeeShopAddress) revert CoffeeNFT__NotCoffeeShop();
        _;
    }

    ///////////////
    // Constructor //
    ///////////////

    constructor(address coffeeShopAddress) ERC721("Coffee Shop Receipt", "CSR") {
        s_tokenCounter = 0;
        i_coffeeShopAddress = coffeeShopAddress;
    }

    /////////////////////
    // Main Functions //
    /////////////////////

    /*
     * @notice Method for minting the receipt nft
     * @param buyer: Buyer of the coffee and address the nft will go to
     */
    function mintNft(address buyer) public onlyCoffeeShop returns (uint256) {
        _safeMint(buyer, s_tokenCounter);
        emit NftMinted(buyer, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
        return s_tokenCounter;
    }

    /*
     * @notice Method for setting the tokenURI of the receipt nfts
     */
    function tokenURI(uint256 /*tokenId*/) public pure override returns (string memory) {
        return TOKEN_URI;
    }

    /*
     * @notice Method for minting the receipt nft
     * @param _tokenIds: Array of token ID's that will be burned in exchange for a free coffee
     */
    function burnTokens(uint256[3] memory _tokenIds) public virtual {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(
                _isApprovedOrOwner(_msgSender(), _tokenIds[i]),
                "CoffeeNFT: caller is not token owner or approved"
            );
        }
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _burn(_tokenIds[i]);
            emit NftBurned(msg.sender, _tokenIds[i]);
        }
    }

    /////////////////////
    // Getter Functions //
    /////////////////////

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
