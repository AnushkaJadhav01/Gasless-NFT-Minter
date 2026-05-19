// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GaslessBadge is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event BadgeMinted(address indexed to, uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("Gasless Badge", "GBADGE") Ownable(initialOwner) {}

    /**
     * @dev Simple mint function. Open to everyone for demo purposes.
     * @param to The address that will receive the minted badge.
     * @param tokenURI The metadata URI for the badge.
     */
    function mintBadge(address to, string memory tokenURI) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit BadgeMinted(to, tokenId);
    }

    /**
     * @dev Get total number of badges minted.
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}
