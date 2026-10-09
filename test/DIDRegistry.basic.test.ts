import { expect } from "chai";
import { ethers } from "hardhat";

describe("DIDRegistry - Core", function () {
  let contract: any;
  let user: any;
  let otherUser: any;

  beforeEach(async function () {
    [user, otherUser] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("DIDRegistry");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("should register and retrieve DID by wallet address", async function () {
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-identity")
    );

    await contract.connect(user).registerDID(hash);

    const did = await contract.getDID(user.address);

    expect(did.owner).to.equal(user.address);
    expect(did.identityHash).to.equal(hash);
    expect(did.createdAt).to.be.greaterThan(0n);
    expect(did.updatedAt).to.equal(did.createdAt);
  });

  it("should update DID correctly", async function () {
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-identity")
    );

    const newHash = ethers.keccak256(
      ethers.toUtf8Bytes("updated-identity")
    );

    await contract.connect(user).registerDID(hash);
    await contract.connect(user).updateDID(newHash);

    const did = await contract.getDID(user.address);

    expect(did.owner).to.equal(user.address);
    expect(did.identityHash).to.equal(newHash);
    expect(did.updatedAt).to.be.greaterThanOrEqual(did.createdAt);
  });

  it("should confirm whether a wallet has a DID", async function () {
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-identity")
    );

    expect(await contract.hasDID(user.address)).to.equal(false);

    await contract.connect(user).registerDID(hash);

    expect(await contract.hasDID(user.address)).to.equal(true);
  });

  it("should allow retrieving another user's DID by address", async function () {
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-identity")
    );

    await contract.connect(user).registerDID(hash);

    const did = await contract.getDID(user.address);

    expect(did.owner).to.equal(user.address);
    expect(did.identityHash).to.equal(hash);

    // Reading another user's DID must not grant control over it.
    expect(await contract.hasDID(otherUser.address)).to.equal(false);
  });
});