// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DIDRegistry {

    struct DID {
        address owner;
        bytes32 identityHash;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => DID) private dids;

    event DIDRegistered(address indexed owner, bytes32 identityHash, uint256 createdAt);
    event DIDUpdated(address indexed owner, bytes32 newIdentityHash, uint256 updatedAt);

    modifier onlyDIDOwner() {
        require(dids[msg.sender].owner != address(0), "DID does not exist");
        _;
    }

function registerDID(bytes32 _identityHash) external {
    require(!_exists(msg.sender), "DID already registered");

    DID storage userDID = dids[msg.sender];

    userDID.owner = msg.sender;
    userDID.identityHash = _identityHash;
    userDID.createdAt = block.timestamp;
    userDID.updatedAt = block.timestamp;

    emit DIDRegistered(msg.sender, _identityHash, block.timestamp);
}

    function getDID() external view returns (DID memory) {
        require(dids[msg.sender].owner != address(0), "DID does not exist");
        return dids[msg.sender];
    }

    function hasDID(address _user) public view returns (bool) {
        return dids[_user].owner != address(0);
    }

    function updateDID(bytes32 _newIdentityHash) external {
    require(_exists(msg.sender), "DID does not exist");

    DID storage userDID = dids[msg.sender];

    userDID.identityHash = _newIdentityHash;
    userDID.updatedAt = block.timestamp;

    emit DIDUpdated(msg.sender, _newIdentityHash, block.timestamp);
}

    function _exists(address _user) internal view returns (bool) {
        return dids[_user].owner != address(0);
    }
}
