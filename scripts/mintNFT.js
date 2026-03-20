const fs = require("fs");
require("dotenv").config();
const { ethers } = require("hardhat");
const hre = require("hardhat");

const DATA_DEPLOYED_FILE = "data-deployed.json";

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = hre.network.name;

  const deployedData = JSON.parse(fs.readFileSync(DATA_DEPLOYED_FILE, "utf8"));
  const proxyAddress = deployedData[`MCC721A.${networkName}`]?.proxy_address;

  if (!proxyAddress) {
    throw new Error(`Proxy address not found for MCC721A.${networkName}`);
  }

  console.log("=".repeat(60));
  console.log("Mint NFT");
  console.log("=".repeat(60));
  console.log("Network:", networkName);
  console.log("Proxy:", proxyAddress);
  console.log("Deployer:", deployer.address);
  console.log("");

  const contract = await ethers.getContractAt("NEW_MCC721A", proxyAddress, deployer);

  const defaultAttr = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const tx = await contract.mint(deployer.address, 1, defaultAttr);
  await tx.wait();
  console.log(`Minted 1 NFT -> ${deployer.address} (tx: ${tx.hash})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
