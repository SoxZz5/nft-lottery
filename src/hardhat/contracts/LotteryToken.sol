// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Lottery.sol";

library SpaceShips {
    struct Ship {
        ShipParts parts;
    }

    struct ShipParts {
        uint256 body;
        uint256 skin;
        uint256 weapon;
        uint256 booster;
    }

    function toString(Ship memory ship) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                Strings.toString(ship.parts.body),
                "_",
                Strings.toString(ship.parts.skin),
                "_",
                Strings.toString(ship.parts.weapon),
                "_",
                Strings.toString(ship.parts.booster)
                )
            );
    }
}

contract LotteryToken is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    string public CID;
    Lottery public lottery;
    Counters.Counter private _tokenIdsCounter;
    mapping(uint256 => SpaceShips.Ship) private _lotteryTickets;

    constructor(Lottery _lottery, string memory _name, string memory _symbol, string memory _CID) ERC721(_name, _symbol) {
        require(bytes(_CID).length > 0, "No CID provided");
        CID = _CID;
        lottery = _lottery;
    }

    /*
        * Returns the ship data from a tokenId
    */
    function getShip(uint256 tokenId) public view returns (SpaceShips.Ship memory) {
        return _lotteryTickets[tokenId];
    }

    /*
        * Returns the collection's metadata URI
        * https://docs.opensea.io/docs/contract-level-metadata
    */
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked("ipfs://", CID, "/collection-metadata.json"));
    }

    /*
        * Returns the token URI
    */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory jsonName;
        if(lottery.isComplete() && !lottery.isWinningTicket(tokenId)){
            // Loser ticket
            jsonName = "destroyed";
        } else {
            // Lottery is not complete or ticket is a winner
            SpaceShips.Ship memory ship = _lotteryTickets[tokenId];
            jsonName = SpaceShips.toString(ship);
        }
        return string(abi.encodePacked("ipfs://", CID, "/", jsonName, ".json"));
    }

    /*
        * Allows to mint a new token
        * Only the owner (the lottery) can call this function
    */
    function mint(address recipient, SpaceShips.Ship memory spaceShip) public onlyOwner returns(uint256) {
        uint256 tokenId = _tokenIdsCounter.current();
        _safeMint(recipient, tokenId);
        
        _lotteryTickets[tokenId] = spaceShip;

        _tokenIdsCounter.increment();
        return tokenId;
    }
}