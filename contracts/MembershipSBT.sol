// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC5192.sol";
import "./IERC5484.sol";

// MembershipSBT is a contract for creating non-transferable membership tokens.
contract MembershipSBT is ERC721, Ownable, IERC5192, IERC5484 {
    string private _baseURIextended;
    uint256 public maxSupply;
    uint256 private _nextTokenId;
    mapping(uint256 => bool) private _locks;
    BurnAuth private _defaultBurnAuth;
    mapping(uint256 => BurnAuth) private _burnAuths;

    // Events for logging state changes.
    event BaseURISet(string baseURI, string image, string description);
    event MaxSupplySet(uint256 maxSupply);
    event DefaultBurnAuthSet(BurnAuth defaultBurnAuth);

    // Constructor initializes the contract with provided parameters.
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 _maxSupply,
        BurnAuth defaultBurnAuth,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _baseURIextended = baseURI;
        maxSupply = _maxSupply;
        _defaultBurnAuth = defaultBurnAuth;
    }

    // _baseURI returns the base URI set for the tokens.
    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }

    // locked checks if a token is locked (non-transferable).
    function locked(uint256 tokenId) public view override returns (bool) {
        return _locks[tokenId];
    }

    // lock locks a token, making it non-transferable.
    function lock(uint256 tokenId) public onlyOwner {
        _locks[tokenId] = true;
        emit Locked(tokenId);
    }

    // unlock unlocks a token, allowing transfer.
    function unlock(uint256 tokenId) public onlyOwner {
        _locks[tokenId] = false;
        emit Unlocked(tokenId);
    }

    // safeMint mints a new token to a given address.
    function safeMint(address to) public onlyOwner {
        require(balanceOf(to) == 0, "You can mint only one token");
        require(
            maxSupply == 0 || _nextTokenId < maxSupply,
            "Max supply reached"
        );
        uint256 tokenId = _nextTokenId++;
        _burnAuths[tokenId] = _defaultBurnAuth;
        _safeMint(to, tokenId);
        lock(tokenId);
        emit Issued(msg.sender, to, tokenId, _burnAuths[tokenId]);
    }

    // safeMintBatch mints tokens to multiple addresses.
    function safeMintBatch(address[] memory to) public onlyOwner {
        for (uint256 i = 0; i < to.length; i++) {
            safeMint(to[i]);
        }
    }

    // burnAuth returns the burn authorization type for a token.
    function burnAuth(
        uint256 tokenId
    ) external view override returns (BurnAuth) {
        return _burnAuths[tokenId];
    }

    // burn allows burning of a token based on the burn authorization.
    function burn(uint256 tokenId) public {
        BurnAuth auth = _burnAuths[tokenId];
        if (auth == BurnAuth.IssuerOnly) {
            require(owner() == msg.sender, "Only issuer can burn");
        }
        if (auth == BurnAuth.OwnerOnly) {
            require(ownerOf(tokenId) == msg.sender, "Only owner can burn");
        }
        if (auth == BurnAuth.Both) {
            require(
                owner() == msg.sender || ownerOf(tokenId) == msg.sender,
                "Only issuer or owner can burn"
            );
        }
        if (auth == BurnAuth.Neither) {
            revert("Burning not allowed");
        }
        _burn(tokenId);
    }

    // setAll updates various parameters of the contract.
    function setAll(
        string memory baseURI,
        uint256 _maxSupply,
        BurnAuth defaultBurnAuth,
        string memory image,
        string memory description
    ) public onlyOwner {
        // Update base URI if it has changed.
        if (
            keccak256(abi.encodePacked(_baseURI())) !=
            keccak256(abi.encodePacked(baseURI))
        ) {
            _baseURIextended = baseURI;
            emit BaseURISet(baseURI, image, description);
        }
        // Update max supply if it has changed.
        if (maxSupply != _maxSupply) {
            maxSupply = _maxSupply;
            emit MaxSupplySet(_maxSupply);
        }
        // Update default burn authorization if it has changed.
        if (_defaultBurnAuth != defaultBurnAuth) {
            _defaultBurnAuth = defaultBurnAuth;
            for (uint256 i = 0; i < _nextTokenId; i++) {
                _burnAuths[i] = defaultBurnAuth;
            }
            emit DefaultBurnAuthSet(defaultBurnAuth);
        }
    }

    // supportsInterface checks if the contract supports certain interfaces.
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721) returns (bool) {
        return
            interfaceId == type(IERC5192).interfaceId ||
            interfaceId == type(IERC5484).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // _update overrides ERC721's _update to incorporate token lock logic.
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721) returns (address) {
        if (locked(tokenId)) {
            require(to == address(0), "Token is locked");
        }
        return super._update(to, tokenId, auth);
    }
}
