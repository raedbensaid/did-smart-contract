import { expect } from "chai";
import { ethers } from "hardhat";

describe("DIDRegistry - Security", function () {
  let contract: any;
  let owner: any;
  let user: any;
  let attacker: any;

  beforeEach(async function () {
    [owner, user, attacker] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("DIDRegistry");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("should NOT allow double registration", async function () {
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-identity")
    );

    await contract.connect(user).registerDID(hash);

    await expect(
      contract.connect(user).registerDID(hash)
    ).to.be.revertedWith("DID already registered");
  });

  it("should NOT allow an attacker to update another user's DID", async function () {
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-identity")
    );

    const maliciousHash = ethers.keccak256(
      ethers.toUtf8Bytes("malicious-identity")
    );

    await contract.connect(user).registerDID(hash);

    // The attacker has no DID of their own.
    await expect(
      contract.connect(attacker).updateDID(maliciousHash)
    ).to.be.revertedWith("DID does not exist");

    // The original user's record must remain unchanged.
    const did = await contract.getDID(user.address);

    expect(did.identityHash).to.equal(hash);
    expect(did.owner).to.equal(user.address);
  });

  it("should NOT allow reading a non-existent DID", async function () {
    await expect(
      contract.getDID(attacker.address)
    ).to.be.revertedWith("DID does not exist");
  });

  it("should return false for a wallet without a DID", async function () {
    expect(await contract.hasDID(attacker.address)).to.equal(false);
  });

  it("should NOT allow updating a DID that does not exist", async function () {
    const newHash = ethers.keccak256(
      ethers.toUtf8Bytes("new-identity")
    );

    await expect(
      contract.connect(user).updateDID(newHash)
    ).to.be.revertedWith("DID does not exist");
  });

  it("should NOT allow registering a zero identity hash", async function () {
    await expect(
      contract.connect(user).registerDID(ethers.ZeroHash)
    ).to.be.revertedWith("Invalid identity hash");
  });

  it("should NOT allow updating to a zero identity hash", async function () {
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-identity")
    );

    await contract.connect(user).registerDID(hash);

    await expect(
      contract.connect(user).updateDID(ethers.ZeroHash)
    ).to.be.revertedWith("Invalid identity hash");

    // The existing hash must remain unchanged.
    const did = await contract.getDID(user.address);

    expect(did.identityHash).to.equal(hash);
  });
});