// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library SpaceShips {
    struct Ship {
        ShipParts parts;
    }

    struct ShipParts {
        uint body;
        uint bodySkin;
        uint reactor;
        uint reactorSkin;
        uint weapon;
        uint weaponSkin;
    }

    function toString(Ship memory ship) internal pure returns(string memory) {
        return string(abi.encodePacked(Strings.toString(ship.parts.body), "-", Strings.toString(ship.parts.bodySkin), // Body
                                        "_", 
                                        Strings.toString(ship.parts.reactor), "-", Strings.toString(ship.parts.reactorSkin), // Skin
                                        "_", 
                                        Strings.toString(ship.parts.weapon), "-", Strings.toString(ship.parts.weaponSkin))); // Weapon
    }
}

contract LotteryToken is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    string public CID;
    Counters.Counter private _tokenIdsCounter;
    mapping(uint256 => SpaceShips.Ship) private _allSpaceShips;

    constructor(string memory _name, string memory _symbol, string memory _CID) ERC721(_name, _symbol) {
        bytes memory tempCID = bytes(_CID);
        require(tempCID.length > 0, "No CID provided");
        CID = _CID;
    }

    function getShip(uint256 tokenId) public view returns (SpaceShips.Ship memory) {
        return _allSpaceShips[tokenId];
    }

    /*
        * Returns the collection's metadata URI
        * https://docs.opensea.io/docs/contract-level-metadata
    */
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked("ipfs://", CID, "/collection-metadata.json"));
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        SpaceShips.Ship memory ship = _allSpaceShips[tokenId];
        return string(abi.encodePacked("ipfs://", CID, "/", SpaceShips.toString(ship), ".json"));
    }

    // function _destroySpaceShip(uint256 tokenId) internal {
    //     _spaceShipDatas[tokenId].isDestroyed = true;
    //     //TODO: change ifps for destroyed ship , sorry boys !
    // }

    function mint(address recipient, SpaceShips.Ship memory spaceShip) public onlyOwner returns(uint256) {
        uint256 tokenId = _tokenIdsCounter.current();
        _safeMint(recipient, tokenId);
        
        _allSpaceShips[tokenId] = spaceShip;

        _tokenIdsCounter.increment();
        return tokenId;
    }
}