import "@nomiclabs/hardhat-waffle";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

const MUMBAI_URL = process.env.NEXT_PUBLIC_MUMBAI_URL as string;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY as string;

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
