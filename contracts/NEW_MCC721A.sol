// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.5;

import 'erc721a-upgradeable/contracts/ERC721AUpgradeable.sol';
import 'erc721a-upgradeable/contracts/IERC721AUpgradeable.sol';
import 'erc721a-upgradeable/contracts/extensions/ERC721ABurnableUpgradeable.sol';
import 'erc721a-upgradeable/contracts/extensions/ERC721AQueryableUpgradeable.sol';
import {ERC721AStorage} from 'erc721a-upgradeable/contracts/ERC721AStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import './Utils/OwnerOperator.sol';
import './Attributes.sol';
import './Locker/ILocker721.sol';

contract NEW_MCC721A is
    Initializable,
    ERC721AUpgradeable,
    ERC721ABurnableUpgradeable,
    ERC721AQueryableUpgradeable,
    OwnerOperator,
    AllItem
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    // Base URI
    string private _baseURIExtended;

    // constructor(string memory name_, string memory symbol_) ERC721A(name_, symbol_) {}
    function __MCC721A_init(string memory name_, string memory symbol_) public initializerERC721A initializer {
        __ERC721A_init(name_, symbol_);
        __ERC721ABurnable_init();
        __ERC721AQueryable_init();
        OwnerOperator.initialize();
    }

    ILocker public addressLocker;
    mapping(uint256 => uint256) nftPerCategory;
    
    // Storage for updated name and symbol (added for upgrade capability)
    // IMPORTANT: These variables MUST be at the end to avoid storage collision when upgrading
    string private _updatedName;
    string private _updatedSymbol;
    
    event Minted(address to, uint256 fromTokenId, uint256 toTokenId, uint32[15] atr);

    function setLocker(address _locker) public operatorOrOwner {
        addressLocker = ILocker(_locker);
    }

    function mint(address to, uint256 quantity, uint32[15] memory atr) public operatorOrOwner {
        for (uint256 i; i < quantity; i++) {
            _tokenIdCounter.increment();
            attributes[_tokenIdCounter.current()] = atr;
        }

        nftPerCategory[atr[0]] += quantity;

        _mint(to, quantity);
    }

    function burn(uint256 tokenId) public virtual override {
        require(!addressLocker.isTokenLocked(tokenId), 'TokenId was Locked');
        nftPerCategory[attributes[tokenId][0]] -= 1;
        _burn(tokenId, true);
    }

    function safeMint(address to, uint256 quantity, bytes memory _data, uint32[15] memory atr) public operatorOrOwner {
        for (uint256 i; i < quantity; i++) {
            _tokenIdCounter.increment();
            attributes[_tokenIdCounter.current()] = atr;
        }

        nftPerCategory[atr[0]] += quantity;

        _safeMint(to, quantity, _data);
    }

    function burn(uint256 tokenId, bool approvalCheck) public operatorOrOwner {
        _burn(tokenId, approvalCheck);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable virtual override(ERC721AUpgradeable, IERC721AUpgradeable) {
        require(!addressLocker.isTokenLocked(tokenId), 'TokenId was Locked');
        require(addressLocker.isValidTransfer(_msgSenderERC721A(), to), 'Invalid Transfer');
        super.transferFrom(from, to, tokenId);
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        _baseURIExtended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    function getOwnershipAt(uint256 index) public view returns (TokenOwnership memory) {
        return _ownershipAt(index);
    }

    function totalMinted() public view onlyOwner returns (uint256) {
        return _totalMinted();
    }

    function totalBurned() public view onlyOwner returns (uint256) {
        return _totalBurned();
    }

    function numberBurned(address owner) public view onlyOwner returns (uint256) {
        return _numberBurned(owner);
    }

    function numberMinted(address owner) public view onlyOwner returns (uint256) {
        return _numberMinted(owner);
    }

    function nextTokenId() public view onlyOwner returns (uint256) {
        return _nextTokenId();
    }

    function getAux(address owner) public view onlyOwner returns (uint64) {
        return _getAux(owner);
    }

    function setAux(address owner, uint64 aux) public onlyOwner {
        _setAux(owner, aux);
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function exists(uint256 tokenId) public view onlyOwner returns (bool) {
        return _exists(tokenId);
    }

    function toString(uint256 x) public pure returns (string memory) {
        return _toString(x);
    }

    function getOwnershipOf(uint256 index) public view returns (TokenOwnership memory) {
        return _ownershipOf(index);
    }

    function initializeOwnershipAt(uint256 index) public onlyOwner {
        _initializeOwnershipAt(index);
    }

    function getTotalNFTPerCategory(uint256 _category) public view returns(uint256){
        return nftPerCategory[_category];
    }

    function getCategories(uint256[] calldata _tokenIds) public view returns(uint256[] memory){
        uint256[] memory _categories = new uint256[](_tokenIds.length);
        for(uint256 i = 0; i < _tokenIds.length; ++i){
            _categories[i] = attributes[_tokenIds[i]][0];
        }

        return _categories;
    }

    // Override name() to return updated name if set, otherwise return original
    function name() public view virtual override(ERC721AUpgradeable, IERC721AUpgradeable) returns (string memory) {
        if (bytes(_updatedName).length > 0) {
            return _updatedName;
        }
        return super.name();
    }

    // Override symbol() to return updated symbol if set, otherwise return original
    function symbol() public view virtual override(ERC721AUpgradeable, IERC721AUpgradeable) returns (string memory) {
        if (bytes(_updatedSymbol).length > 0) {
            return _updatedSymbol;
        }
        return super.symbol();
    }

    // Update name and symbol for the NFT collection
    function updateNameAndSymbol(string memory newName, string memory newSymbol) public onlyOwner {
        require(bytes(newName).length > 0, "Name cannot be empty");
        require(bytes(newSymbol).length > 0, "Symbol cannot be empty");
        
        // Update our custom storage variables
        _updatedName = newName;
        _updatedSymbol = newSymbol;
        
        // Also update the original ERC721A storage to ensure compatibility
        // This ensures Etherscan and other tools can read the updated values
        // Note: Etherscan may cache the old values and require manual update via their form
        ERC721AStorage.layout()._name = newName;
        ERC721AStorage.layout()._symbol = newSymbol;
    }

}
