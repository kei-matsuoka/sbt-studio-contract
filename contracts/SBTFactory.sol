// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MembershipSBT.sol";

// SBTFactory is a contract for creating MembershipSBT instances.
contract SBTFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    // Creation fee for generating a new SBT.
    uint256 public creationFee;

    // Event for logging the creation of new SBTs.
    event SBTCreated(
        address sbtAddress,
        string name,
        string symbol,
        uint256 maxSupply,
        IERC5484.BurnAuth defaultBurnAuth,
        string image,
        string description
    );

    // Constructor to disable initializer for the proxy pattern.
    constructor() {
        _disableInitializers();
    }

    // Initializer function for setting up contract instances.
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        creationFee = 0.01 ether;
    }

    // Internal function to authorize contract upgrades.
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    // Function to create a new MembershipSBT contract.
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

    // Function to withdraw collected fees to the owner's address.
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Function to set or update the creation fee.
    function setCreationFee(uint256 _creationFee) public onlyOwner {
        creationFee = _creationFee;
    }
}
