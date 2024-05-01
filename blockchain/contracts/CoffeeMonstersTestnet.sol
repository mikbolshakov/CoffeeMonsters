// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract CoffeeMonstersTestnet is ERC721, ERC721Enumerable, ERC2981, Ownable {
    uint256 private _nextTokenId;

    constructor(
        uint96 _feeNumerator
    ) ERC721("CoffeeMonstersTestnet", "CMT") Ownable(msg.sender) {
        _setDefaultRoyalty(msg.sender, _feeNumerator);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmUajt7AGbi5uq1e6wfQMo96oBKW44cpX3U1FM7USVB5XT";
    }

    function tokenURI(
        uint256 tokenId
    ) public pure override returns (string memory) {
        string memory baseURI = _baseURI();
        return baseURI;
    }

    function safeMint() external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC2981, ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
