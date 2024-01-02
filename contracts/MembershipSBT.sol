// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC5192.sol";
import "./IERC5484.sol";

contract MembershipSBT is ERC721, Ownable, IERC5192, IERC5484 {
    string private _baseURIextended;
    uint256 public maxSupply;
    uint256 private _nextTokenId;
    mapping(uint256 => bool) private _locks;
    BurnAuth private _defaultBurnAuth;
    mapping(uint256 => BurnAuth) private _burnAuths;

    event BaseURISet(string baseURI, string image, string description);

    event MaxSupplySet(uint256 maxSupply);

    event BurnAuthSet(uint256 tokenId, BurnAuth burnAuth);

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

    // baseURI
    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }

    // lock
    function locked(uint256 tokenId) public view override returns (bool) {
        return _locks[tokenId];
    }

    function lock(uint256 tokenId) public onlyOwner {
        _locks[tokenId] = true;
        emit Locked(tokenId);
    }

    function unlock(uint256 tokenId) public onlyOwner {
        _locks[tokenId] = false;
        emit Unlocked(tokenId);
    }

    // mint
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

    function safeMintBatch(address[] memory to) public onlyOwner {
        for (uint256 i = 0; i < to.length; i++) {
            safeMint(to[i]);
        }
    }

    // burn
    function burnAuth(
        uint256 tokenId
    ) external view override returns (BurnAuth) {
        return _burnAuths[tokenId];
    }

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

    // setFunctions
    function setBaseURI(
        string memory baseURI,
        string memory image,
        string memory description
    ) public onlyOwner {
        _baseURIextended = baseURI;
        emit BaseURISet(baseURI, image, description);
    }

    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply;
        emit MaxSupplySet(_maxSupply);
    }

    function setBurnAuth(
        uint256 _tokenId,
        BurnAuth _burnAuth
    ) public onlyOwner {
        _burnAuths[_tokenId] = _burnAuth;
        emit BurnAuthSet(_tokenId, _burnAuth);
    }

    // supportsInterface
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721) returns (bool) {
        return
            interfaceId == type(IERC5192).interfaceId ||
            interfaceId == type(IERC5484).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // update
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
