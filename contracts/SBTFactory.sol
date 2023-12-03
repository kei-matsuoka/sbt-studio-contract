// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MembershipSBT.sol";

contract SBTFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    event SBTCreated(
        address indexed creator,
        address sbtAddress,
        string name,
        string symbol,
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
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function createMembershipSBT(
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory image,
        string memory description
    ) public returns (address) {
        MembershipSBT sbt = new MembershipSBT(name, symbol, baseURI);
        emit SBTCreated(
            msg.sender,
            address(sbt),
            name,
            symbol,
            image,
            description
        );
        return address(sbt);
    }
}
