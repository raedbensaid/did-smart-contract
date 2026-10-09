import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("DIDRegistry - Events", function () {
  let contract: any;
  let user: any;

  beforeEach(async () => {
    [user] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("DIDRegistry");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("should emit DIDRegistered event", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("did"));

    await expect(contract.connect(user).registerDID(hash))
      .to.emit(contract, "DIDRegistered")
      .withArgs(user.address, hash, anyValue);
  });

  it("should emit DIDUpdated event", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("did"));
    const newHash = ethers.keccak256(ethers.toUtf8Bytes("new"));

    await contract.connect(user).registerDID(hash);

    await expect(contract.connect(user).updateDID(newHash))
      .to.emit(contract, "DIDUpdated")
      .withArgs(user.address, newHash, anyValue);
  });
});