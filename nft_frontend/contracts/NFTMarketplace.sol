// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

// Inheriting property from ERC721URIStorage contract
contract NFTMarketplace is ERC721URIStorage{
    // using the contract of Counters 
    using Counters for Counters.Counter;

    // variables
    Counters.Counter private _tokenIds; // every nft will have a unique id
    Counters.Counter private _itemsSold; // keep track of how many tokens getting sold

    uint256 listingPrice = 0.0025 ether; // initializing the listing price state variable.

    address payable owner; // whoever deploys this smart contract will become the owner. This is payable so that owner can receive funds.

    mapping(uint256 => MarketItem) private idMarketItem; // the nft ids will be mapped to a struct called MarketItem, which contains all the details for that particular nft (i.e. owner, seller of the contract, id, balance, sell property, etc).

    // defining the struct
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // whenever any kind of transaction (buying or selling) happens, we have to trigger an event. This event function is a standard code for nft smart contract for a marketplace. This is defined in the openzeppelin smart contract.
    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // make sure only the owner can change the listing price.
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "only owner of the marketplace can change the listing price."
        );
        _; // once this modifier is true, then the other function will keep continuing.
    }

    // constructor already defined in ERC721.sol
    constructor() ERC721("NFT Metaverse Token", "MYNFT"){
        owner = payable(msg.sender); // set owner as the person who deploys the contract.
    }

    // updating the price listing.
    function updateListingPrice(uint256 _listingPrice) public payable onlyOwner{
        listingPrice = _listingPrice;
    }

    // the view keyword is used to read a state variable (i.e. listingPrice).
    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }

    // Let's create "CREATE NFT TOKEN FUNCTION" - create a token (& token id) and assign to a particular nft.
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint256){
        _tokenIds.increment(); // whenever someone creates an NFT, this token id will get increased.

        uint256 newTokenId = _tokenIds.current(); // after incrementing the token id, this is assigned to the newTokenId variable.

        _mint(msg.sender, newTokenId); // using the mint function from openzeppelin
        _setTokenURI(newTokenId, tokenURI); // set the token id using this function from openzeppelin

        createMarketItem(newTokenId, price); // function I will create.

        return newTokenId;
    }

    // CREATING MARKET ITEM - create the nft and assign all the data to that particular nft.
    function createMarketItem(uint256 tokenId, uint256 price) private{
        require(price > 0, "Price must be at least 1");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        idMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender), // anybody who tries to create the nft.
            payable(address(this)), // address(this) is the smart contract.
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId); // transfer the nft from the msg.sender(one who created the nft) to the contract.

        // call this event again since a transfer is happening.
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    // function for resale token - allow users to resell/sell their nft (with a higher price)
    function resellToken(uint256 tokenId, uint256 price) public payable{
        require(idMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation/purchase");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        idMarketItem[tokenId].sold = false;
        idMarketItem[tokenId].price = price;
        idMarketItem[tokenId].seller = payable(msg.sender);
        idMarketItem[tokenId].owner = payable(address(this)); // when someone resells their nft, the nft will go to the contract and the contract becomes the owner.

        _itemsSold.decrement(); // whenever someone resells an nft, the total number of items sold will decrease.

        _transfer(msg.sender, address(this), tokenId);
    }

    // function create market sale
    function createMarketSale(uint256 tokenId) public payable{
        uint256 price = idMarketItem[tokenId].price; // we can get the price of the nft.

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idMarketItem[tokenId].owner = payable(msg.sender);
        idMarketItem[tokenId].sold = true;
        idMarketItem[tokenId].owner = payable(address(0)); // at this moment, the nft doesn't below to the contract.

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        // earn the commission fee
        payable(owner).transfer(listingPrice);
        payable(idMarketItem[tokenId].seller).transfer(msg.value);
    }

    // function that returns the unsold nft that belongs to the contract address.
    function fetchMarketItem() public view returns(MarketItem[] memory){
        uint256 itemCount = _tokenIds.current();
        uint256 unSoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unSoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idMarketItem[i + 1].owner == address(this)){
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


    // function that returns the nft that belongs to a particular address.
    function fetchMyNFT() public view returns(MarketItem[] memory){
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // single user items
    function fetchItemsListed() public view returns (MarketItem[] memory){
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint256 i = 0; i < totalCount; i++) {
            if(idMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}