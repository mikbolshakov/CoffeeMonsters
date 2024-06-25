// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract CoffeeMonsters is ERC721, ERC721Enumerable, ERC2981, Ownable {
    using Strings for uint256;
    uint256 private _nextTokenId;

    address immutable creatorAddress;
    address immutable developerAddress;
    address immutable designerAddress;

    uint256 public constant MAX_TOKENS = 666;
    uint256 public constant MINT_PRICE = 0.00666 ether;
    uint256 public constant PARTNERS_MINT_PRICE = 0.00333 ether;
    string baseURI;
    string baseExtension = ".json";

    constructor(
        address _creator,
        address _developer,
        address _designer,
        address _royaltyReceiver,
        uint96 _feeNumerator,
        address[] memory _freeMintReceivers
    ) ERC721("CoffeeMonsters", "CM") Ownable(_developer) {
        _setDefaultRoyalty(_royaltyReceiver, _feeNumerator);
        creatorAddress = _creator;
        developerAddress = _developer;
        designerAddress = _designer;
        freeMint(_freeMintReceivers);
    }

    /// @notice Set the base URI for all token IDs.
    /// @param _newuri The new base URI.
    function setURI(string memory _newuri) external onlyOwner {
        baseURI = _newuri;
    }

    /// @notice Get the URI of a token.
    /// @param _tokenId ID of the token.
    /// @return URI of the token.
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string memory base = baseURI;
        string memory extension = baseExtension;
        return string(abi.encodePacked(base, _tokenId.toString(), extension));
    }

    function safeMint(uint256 _amount) external payable {
        require(totalSupply() + _amount <= MAX_TOKENS, "Max collection limit!");
        require(msg.value >= (MINT_PRICE * _amount), "Tx value below price");

        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
        }
    }

    function safeMintForPartners(uint256 _amount) external payable {
        require(totalSupply() + _amount <= MAX_TOKENS, "Max collection limit!");
        require(
            msg.value >= (PARTNERS_MINT_PRICE * _amount),
            "Tx value below price"
        );

        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
        }
    }

    function freeMint(address[] memory _receivers) private {
        uint256 addressesNumber = _receivers.length;

        for (uint256 i = 0; i < addressesNumber; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(_receivers[i], tokenId);
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
