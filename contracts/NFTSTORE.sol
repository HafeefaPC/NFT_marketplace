// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTSTORE is ERC721URIStorage{
    address payable public marketplaceOwner;
    uint256 public listingFeePercentage = 20;
    uint256 private CurrentTokenId;
    uint256 private totalItemsSold;

    struct Item {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        
    }

    mapping(uint256 => NFTListing) private tokenIdToListing;

    modifier onlyOwner() {
        require(msg.sender == marketplaceOwner, "Only owner can call this function");
        _;
    }

    constructor() ERC721("NFTSTORE", "NFTS") {
        marketplaceOwner = payable(msg.sender);
    }
}
