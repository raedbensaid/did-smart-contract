import { expect } from "chai";
import { ethers } from "hardhat";

describe("DIDRegistry - Security", function () {
  let contract: any;
  let owner: any;
  let user: any;
  let attacker: any;

  beforeEach(async () => {
    [owner, user, attacker] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("DIDRegistry");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("should NOT allow double registration", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("did"));

    await contract.connect(user).registerDID(hash);

    await expect(
      contract.connect(user).registerDID(hash)
    ).to.be.revertedWith("DID already registered");
  });

it("should NOT allow non-owner to update DID", async function () {
  const hash = ethers.keccak256(ethers.toUtf8Bytes("did"));
  const newHash = ethers.keccak256(ethers.toUtf8Bytes("new"));

  // user registers DID
  await contract.connect(user).registerDID(hash);

  // using msg.sender to prevent non authorized updates
  await expect(
    contract.connect(attacker).updateDID(newHash)
  ).to.be.revertedWith("DID does not exist");
});

it("should NOT allow reading non-existent DID", async function () {
    await expect(
      contract.connect(attacker).getDID()
    ).to.be.reverted;
  });
});