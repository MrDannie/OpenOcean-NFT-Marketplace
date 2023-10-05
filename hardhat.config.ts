import "@nomiclabs/hardhat-waffle";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

const MUMBAI_URL = process.env.MUMBAI_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

console.log("RU", MUMBAI_URL);

const config: HardhatUserConfig = {
  solidity: "0.8.11",
  networks: {
    mumbai: {
      url: MUMBAI_URL || "",
      accounts: PRIVATE_KEY!== undefined ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;
