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
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const contractName = "MCC721A";

  const tokenName = process.env.TOKEN_NAME || "MCC721A";
  const tokenSymbol = process.env.TOKEN_SYMBOL || "MCC721A";
  const constructorArguments = [tokenName, tokenSymbol];

  console.log("=".repeat(60));
  console.log(`Deploy Upgradeable ${contractName}`);
  console.log("=".repeat(60));
  console.log("Deployer:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("Token Name:", tokenName);
  console.log("Token Symbol:", tokenSymbol);
  console.log("");

  // 1. Deploy proxy
  console.log(`1./ Deploy proxy contract ${contractName}`);
  const MCC721AFac = await ethers.getContractFactory(contractName, deployer);

  const mcc721a = await upgrades.deployProxy(MCC721AFac, constructorArguments, {
    initializer: "__MCC721A_init(string,string)",
    timeout: 0,
  });
  await mcc721a.waitForDeployment();

  const proxyAddress = await mcc721a.getAddress();
  const implementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
  const owner = await mcc721a.owner();
  const txHash = mcc721a.deploymentTransaction()?.hash;

  console.log("Deploy completed!");
  console.log(`Proxy address:          ${proxyAddress}`);
  console.log(`Implementation address: ${implementationAddress}`);
  console.log(`Admin address:          ${adminAddress}`);
  console.log(`Owner:                  ${owner}`);
  console.log(`Tx hash:                ${txHash}`);
  console.log("");

  // 2. Mint 2 NFTs for owner
  console.log("2./ Mint 2 NFTs for owner");
  const defaultAttr = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const tx1 = await mcc721a.mint(deployer.address, 1, defaultAttr);
  await tx1.wait();
  console.log(`Minted NFT #1 -> ${deployer.address} (tx: ${tx1.hash})`);

  const tx2 = await mcc721a.mint(deployer.address, 1, defaultAttr);
  await tx2.wait();
  console.log(`Minted NFT #2 -> ${deployer.address} (tx: ${tx2.hash})`);
  console.log("");

  // 3. Save deployed data
  console.log("3./ Saving deployed data...");
  updateDataDeployed({
    [`${contractName}.${hre.network.name}`]: {
      proxy_address: proxyAddress,
      implement_address: implementationAddress,
      admin_address: adminAddress,
      constructor_argument: constructorArguments,
      deployer: deployer.address,
      owner: owner,
      hash: txHash,
      minted_nfts: [1, 2],
      deployed_at: new Date().toISOString(),
    },
  });

  // 4. Verify on explorer (skip for local networks)
  if (
    hre.network.name === "localhost" ||
    hre.network.name === "hardhat"
  ) {
    console.log("\nSkip verification on local network.");
    return;
  }

  console.log(`\n4./ Verify contract ${contractName}`);
  console.log("Waiting for 6 block confirmations...");
  await mcc721a.deploymentTransaction()?.wait(6);

  try {
    await hre.run("verify:verify", {
      address: implementationAddress,
      constructorArguments: [],
      contract: `contracts/${contractName}.sol:${contractName}`,
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
