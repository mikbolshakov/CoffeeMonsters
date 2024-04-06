// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract CoffeeMonsters is ERC721, ERC721Enumerable, ERC2981 {
    uint256 private _nextTokenId;

    address immutable creatorAddress;
    address immutable developerAddress;
    address immutable designerAddress;

    uint256 public constant MAX_TOKENS = 666;
    uint256 public constant MINT_PRICE = 0.00666 ether;

    constructor(
        address _creator,
        address _developer,
        address _designer,
        address _royaltyReceiver,
        uint96 _feeNumerator
    ) ERC721("CoffeeMonsters", "CM") {
        _setDefaultRoyalty(_royaltyReceiver, _feeNumerator);
        creatorAddress = _creator;
        developerAddress = _developer;
        designerAddress = _designer;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://qqq/";
    }

    function safeMint(address _to, uint256 _amount) external payable {
        require(totalSupply() + _amount <= MAX_TOKENS, "Max collection limit!");
        require(msg.value >= (MINT_PRICE * _amount), "Tx value below price");

        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(_to, tokenId);
        }
    }

    function withdraw() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "Zero balance");
        _widthdraw(developerAddress, (balance * 333) / 1000);
        _widthdraw(designerAddress, (balance * 333) / 1000);
        _widthdraw(creatorAddress, address(this).balance);
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{ value: _amount }("");
        require(success, "Transfer failed.");
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
