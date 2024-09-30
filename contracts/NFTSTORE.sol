// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTSTORE is ERC721URIStorage{
    address payable public marketplaceOwner;
    uint256 public listingFeePercentage = 20;
    uint256 private CurrentTokenId;
    uint256 private totalItemsSold;

    struct NFTListing {
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
    function updateListingFeePercentage(uint256 _listingFeePercentage) public onlyOwner {
        listingFeePercentage = _listingFeePercentage;
    }
    function getListingFeePercentage() public view returns (uint256) {
        return listingFeePercentage;
    } 
    function getCurrentTokenId() public view returns (uint256) {
        return CurrentTokenId;
    }
    function getNFTListing(uint256 _tokenId) public view returns (NFTListing memory) {
        return tokenIdToListing[_tokenId];
    }
    function createToken(string  memory _tokenURI , uint256 _price) public returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        CurrentTokenId++;
        uint256 newTokenId = CurrentTokenId;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        _createNFTListing(newTokenId, _price);
        return newTokenId;
    }
    function _createNFTListing(uint256 _tokenId, uint256 _price) public {
        tokenIdToListing[_tokenId] = NFTListing({
            tokenId:_tokenId,
            owner:payable(msg.sender),
            seller: payable(msg.sender),
            price: _price
            });
    }
    function executeSale(uint256 tokenId) public payable{
        NFTListing storage listing = tokenIdToListing[tokenId];
        uint256 price = listing.price;
        address payable seller = listing.seller;

        require(msg.value == price, "Price must be equal to the listing price");
        listing.seller= payable(msg.sender);
        totalItemsSold++;

        _transfer(listing.owner, msg.sender, tokenId); 

        uint256 listingFee = (price * listingFeePercentage) / 100;
        marketplaceOwner.transfer(listingFee);
        seller.transfer(msg.value - listingFee);
    }
    function getAllListedNFTs() public view returns (NFTListing[] memory) {
        uint256 totalNFTCount = CurrentTokenId;
        NFTListing[] memory listedNFTs = new NFTListing[](totalNFTCount);
        uint256 CurrentIndex =0;
        for (uint256 i = 0; i < totalNFTCount; i++) {
            uint256 tokenId = i+1;
            NFTListing storage listing = tokenIdToListing[tokenId];
            listedNFTs[CurrentIndex] = listing;
            CurrentIndex+=1;
        }
        return listedNFTs;
    }

    function getMyNFTs() public view returns (NFTListing[] memory){
        uint256 totalNFTCount = CurrentTokenId;
        uint256 myNFTCount = 0;
        uint256 CurrentIndex = 0;
        for (uint256 i = 0; i < totalNFTCount; i++) {
            if(tokenIdToListing[i+1].owner == msg.sender || tokenIdToListing[i+1].seller == msg.sender){
                myNFTCount++;
            }
        }
        NFTListing[] memory myNFTs = new NFTListing[](myNFTCount);
        for (uint256 i = 0; i < totalNFTCount; i++) {
            if(tokenIdToListing[i+1].owner == msg.sender || tokenIdToListing[i+1].seller == msg.sender){
               uint256 tokenId = i+1;
                NFTListing storage listing = tokenIdToListing[tokenId];
                myNFTs[CurrentIndex] = listing;
                CurrentIndex+=1;
            }
        }
        return myNFTs;
    } 
}
