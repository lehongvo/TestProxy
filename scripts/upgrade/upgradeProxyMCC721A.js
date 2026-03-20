const fs = require("fs");
require("dotenv").config();
const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

const DATA_DEPLOYED_FILE = "data-deployed.json";

function updateDataDeployed(obj) {
  let dataWrite = obj;
  if (fs.existsSync(DATA_DEPLOYED_FILE)) {
    const data = fs.readFileSync(DATA_DEPLOYED_FILE, "utf8");
    if (data) {
      dataWrite = { ...JSON.parse(data), ...obj };
    }
  }
  fs.writeFileSync(
    DATA_DEPLOYED_FILE,
    JSON.stringify(dataWrite, null, 4) + "\n"
  );
  console.log(`Write data to file ${DATA_DEPLOYED_FILE} successful.`);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = hre.network.name;

  // Read proxy address from data-deployed.json
  const deployedData = JSON.parse(fs.readFileSync(DATA_DEPLOYED_FILE, "utf8"));
  const deployKey = `MCC721A.${networkName}`;
  const proxyAddress = deployedData[deployKey]?.proxy_address;

  if (!proxyAddress) {
    throw new Error(
      `Proxy address not found for key "${deployKey}" in ${DATA_DEPLOYED_FILE}`
    );
  }

  const newContractName = "NEW_MCC721A";
  const newContractFullName = `contracts/${newContractName}.sol:${newContractName}`;

  console.log("=".repeat(60));
  console.log(`Upgrade MCC721A -> ${newContractName}`);
  console.log("=".repeat(60));
  console.log("Deployer:", deployer.address);
  console.log("Network:", networkName);
  console.log("Proxy address:", proxyAddress);

  const currentImpl =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Current implementation:", currentImpl);
  console.log("");

  // 1. Upgrade proxy to NEW_MCC721A
  console.log(`1./ Upgrade proxy to ${newContractName}`);
  const newFactory = await ethers.getContractFactory(newContractFullName, deployer);
  const upgraded = await upgrades.upgradeProxy(proxyAddress, newFactory);
  await upgraded.waitForDeployment();

  const newImpl =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Upgrade completed!");
  console.log("New implementation:", newImpl);
  console.log("");

  // 2. Call updateNameAndSymbol
  const newName = process.env.TOKEN_NAME_NEW || "MCC721A";
  const newSymbol = process.env.TOKEN_SYMBOL_NEW || "MCC721A";
  console.log(`2./ Call updateNameAndSymbol("${newName}", "${newSymbol}")`);

  const txUpdate = await upgraded.updateNameAndSymbol(newName, newSymbol);
  await txUpdate.wait();
  console.log(`updateNameAndSymbol tx: ${txUpdate.hash}`);

  // Verify name/symbol updated
  const updatedName = await upgraded.name();
  const updatedSymbol = await upgraded.symbol();
  console.log(`Verified -> name: "${updatedName}", symbol: "${updatedSymbol}"`);
  console.log("");

  // 3. Mint 1 NFT for owner
  console.log("3./ Mint 1 NFT for owner");
  const defaultAttr = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const txMint = await upgraded.mint(deployer.address, 1, defaultAttr);
  await txMint.wait();
  console.log(`Minted NFT -> ${deployer.address} (tx: ${txMint.hash})`);
  console.log("");

  // 4. Save upgrade data
  console.log("4./ Saving upgrade data...");
  updateDataDeployed({
    [`MCC721A.${networkName}.upgrade`]: {
      proxy_address: proxyAddress,
      old_implement_address: currentImpl,
      new_implement_address: newImpl,
      new_contract: newContractName,
      deployer: deployer.address,
      updated_name: updatedName,
      updated_symbol: updatedSymbol,
      upgraded_at: new Date().toISOString(),
    },
  });

  // 5. Verify on explorer (skip local)
  if (networkName === "localhost" || networkName === "hardhat") {
    console.log("\nSkip verification on local network.");
    return;
  }

  console.log(`\n5./ Verify contract ${newContractName}`);
  console.log("Waiting for 6 block confirmations...");
  await txUpdate.wait(6);

  try {
    await hre.run("verify:verify", {
      address: newImpl,
      constructorArguments: [],
      contract: newContractFullName,
    });
    console.log("Verify successful!");
  } catch (e) {
    if (e.message.includes("Already Verified")) {
      console.log("Contract already verified!");
    } else {
      console.error("Verify failed:", e.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
