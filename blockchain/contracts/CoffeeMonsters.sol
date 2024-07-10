// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

/// @title CoffeeMonsters NFT Collection
/// @notice This contract implements an ERC721 token with enumerable and royalty features.
/// @dev Extends ERC721, ERC721Enumerable, ERC2981, and Ownable from OpenZeppelin.
contract CoffeeMonsters is ERC721, ERC721Enumerable, ERC2981, Ownable {
    using Strings for uint256;
    uint256 private _nextTokenId;

    address immutable creatorAddress;
    address immutable developerAddress;
    address immutable designerAddress;

    uint256 public constant MAX_TOKENS = 666;
    uint256 public constant MINT_PRICE = 0.00666 ether;
    uint256 public constant PARTNERS_MINT_PRICE = 0.00333 ether;
    mapping(address => bool) public isPartner;
    string baseURI;
    string baseExtension = ".json";

    /// @notice Constructor to initialize the CoffeeMonsters contract.
    /// @param _creator Address of the NFT collection creator.
    /// @param _developer Address of the NFT collection developer.
    /// @param _designer Address of the NFT collection designer.
    /// @param _royaltyReceiver Address to receive royalty payments.
    /// @param _feeNumerator Numerator of the royalty fee.
    constructor(
        address _creator,
        address _developer,
        address _designer,
        address _royaltyReceiver,
        uint96 _feeNumerator
    ) ERC721("CoffeeMonsters", "CM") Ownable(_developer) {
        _setDefaultRoyalty(_royaltyReceiver, _feeNumerator);
        creatorAddress = _creator;
        developerAddress = _developer;
        designerAddress = _designer;
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

    /// @notice Mint a specified amount of tokens.
    /// @param _amount Number of tokens to mint.
    function safeMint(uint256 _amount) external payable {
        require(totalSupply() + _amount <= MAX_TOKENS, "Max collection limit!");
        require(msg.value >= (MINT_PRICE * _amount), "Tx value below price");

        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
        }
    }

    /// @notice Mints a new token to the specified address.
    /// @dev Only the owner can call this function.
    /// @param _address The address to which the newly minted token will be assigned.
    function mint(address _address) external onlyOwner {
        require(totalSupply() < MAX_TOKENS, "Max collection limit!");

        uint256 tokenId = _nextTokenId++;
        _safeMint(_address, tokenId);
    }

    /// @notice Mint a token for partners at a discounted price.
    function safeMintForPartners() external payable {
        require(isPartner[msg.sender] == true, "Not a partner");
        require(totalSupply() < MAX_TOKENS, "Max collection limit!");
        require(msg.value >= PARTNERS_MINT_PRICE, "Tx value below price");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        isPartner[msg.sender] = false;
    }

    /// @notice Withdraw the contract balance to the creator, developer, and designer.
    function withdraw() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "Zero balance");

        _widthdraw(developerAddress, (balance * 333) / 1000);
        _widthdraw(designerAddress, (balance * 333) / 1000);
        _widthdraw(creatorAddress, address(this).balance);
    }

    /// @notice Internal function to handle withdrawals.
    /// @param _address The address to send the funds to.
    /// @param _amount The amount of funds to send.
    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{ value: _amount }("");
        require(success, "Transfer failed.");
    }

    /// @notice Internal function to add partner addresses.
    /// @param _partners The addresses to add as partners.
    function addPartners(address[] memory _partners) external onlyOwner {
        uint256 addressesNumber = _partners.length;

        for (uint256 i = 0; i < addressesNumber; i++) {
            isPartner[_partners[i]] = true;
        }
    }

    // The following functions are overrides required by Solidity.

    /// @inheritdoc ERC721
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    /// @inheritdoc ERC721
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    /// @inheritdoc ERC721
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC2981, ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
