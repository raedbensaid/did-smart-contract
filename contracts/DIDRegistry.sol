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
        require(dids[msg.sender].owner == address(0), "DID already registered");

        dids[msg.sender] = DID({
            owner: msg.sender,
            identityHash: _identityHash,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        emit DIDRegistered(msg.sender, _identityHash, block.timestamp);
    }

    function getDID() external view returns (DID memory) {
        require(dids[msg.sender].owner != address(0), "DID does not exist");
        return dids[msg.sender];
    }

    function hasDID(address _user) public view returns (bool) {
        return dids[_user].owner != address(0);
    }

    function updateDID(bytes32 _newIdentityHash) external onlyDIDOwner {
        require(dids[msg.sender].owner != address(0), "DID does not exist");

        dids[msg.sender].identityHash = _newIdentityHash;
        dids[msg.sender].updatedAt = block.timestamp;

        emit DIDUpdated(msg.sender, _newIdentityHash, block.timestamp);
    }
}