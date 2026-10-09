import { expect } from "chai";
import { ethers } from "hardhat";

describe("DIDRegistry - Core", function () {
  let contract: any;
  let user: any;

  beforeEach(async () => {
    [user] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("DIDRegistry");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("should register and retrieve DID", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("did"));

    await contract.connect(user).registerDID(hash);

    const did = await contract.connect(user).getDID();

    expect(did.identityHash).to.equal(hash);
    expect(did.owner).to.equal(user.address);
  });

  it("should update DID correctly", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("did"));
    const newHash = ethers.keccak256(ethers.toUtf8Bytes("new"));

    await contract.connect(user).registerDID(hash);
    await contract.connect(user).updateDID(newHash);

    const did = await contract.connect(user).getDID();

    expect(did.identityHash).to.equal(newHash);
  });
});