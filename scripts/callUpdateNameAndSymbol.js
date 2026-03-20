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

  const newName = process.env.TOKEN_NAME_NEW || "MCC721A";
  const newSymbol = process.env.TOKEN_SYMBOL_NEW || "MCC721A";

  console.log("=".repeat(60));
  console.log("Call updateNameAndSymbol");
  console.log("=".repeat(60));
  console.log("Network:", networkName);
  console.log("Proxy:", proxyAddress);
  console.log("Deployer:", deployer.address);
  console.log(`New Name: "${newName}"`);
  console.log(`New Symbol: "${newSymbol}"`);
  console.log("");

  const contract = await ethers.getContractAt("NEW_MCC721A", proxyAddress, deployer);

  const oldName = await contract.name();
  const oldSymbol = await contract.symbol();
  console.log(`Current -> name: "${oldName}", symbol: "${oldSymbol}"`);

  const tx = await contract.updateNameAndSymbol(newName, newSymbol);
  await tx.wait();
  console.log(`Tx: ${tx.hash}`);

  const updatedName = await contract.name();
  const updatedSymbol = await contract.symbol();
  console.log(`Updated -> name: "${updatedName}", symbol: "${updatedSymbol}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
