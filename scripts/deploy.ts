import { ethers } from "hardhat";

async function main() {
  console.log(" Deploying DIDRegistry...");

  const DIDRegistry = await ethers.getContractFactory("DIDRegistry");

  const contract = await DIDRegistry.deploy();

  console.log(" Waiting for deployment...");

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log(" DIDRegistry deployed to:", address);
  console.log(" Network:", (await ethers.provider.getNetwork()).name);
}

main().catch((error) => {
  console.error(" Deployment failed:", error);
  process.exitCode = 1;
});