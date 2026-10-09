import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-verify";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

if (!PRIVATE_KEY) {
  throw new Error("Missing PRIVATE_KEY in .env");
}

if (!SEPOLIA_RPC_URL) {
  throw new Error("Missing SEPOLIA_RPC_URL in .env");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    hardhat: {},

    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    
},
etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

export default config;