// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DIDRegistry {

    struct DID {
        address owner;
        bytes32 identityHash;
        uint256 createdAt;
        bool exists;
    }
    mapping(address => DID) private dids;

event DIDRegistered(address indexed owner, bytes32 identityHash, uint256 createdAt);

function registerDID(bytes32 _identityHash) external {
    // Check if DID already exists
    require(!dids[msg.sender].exists, "DID already registered");

    // Create DID
    dids[msg.sender] = DID({
        owner: msg.sender,
        identityHash: _identityHash,
        createdAt: block.timestamp,
        exists: true
    });

    emit DIDRegistered(msg.sender, _identityHash, block.timestamp);
}

function getDID() external view returns (DID memory) {
    require(dids[msg.sender].exists, "DID does not exist");
    return dids[msg.sender];
}

function hasDID(address _user) external view returns (bool) {
    return dids[_user].exists;
}

}