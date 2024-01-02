// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MembershipSBT.sol";

contract SBTFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public creationFee;

    event SBTCreated(
        address sbtAddress,
        string name,
        string symbol,
        uint256 maxSupply,
        IERC5484.BurnAuth defaultBurnAuth,
        string image,
        string description
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        creationFee = 0.01 ether;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function createMembershipSBT(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 maxSupply,
        IERC5484.BurnAuth defaultBurnAuth,
        string memory image,
        string memory description
    ) public payable returns (address) {
        require(msg.value == creationFee, "Incorrect fee");
        MembershipSBT sbt = new MembershipSBT(
            name,
            symbol,
            baseURI,
            maxSupply,
            defaultBurnAuth,
            msg.sender
        );
        emit SBTCreated(
            address(sbt),
            name,
            symbol,
            maxSupply,
            defaultBurnAuth,
            image,
            description
        );
        return address(sbt);
    }

    function setCreationFee(uint256 _creationFee) public onlyOwner {
        creationFee = _creationFee;
    }
}
