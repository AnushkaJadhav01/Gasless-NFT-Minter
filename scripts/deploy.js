const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  const GaslessBadge = await hre.ethers.getContractFactory("GaslessBadge");
  const badge = await GaslessBadge.deploy(deployer.address);

  await badge.waitForDeployment();
  const address = await badge.getAddress();
  
  console.log("GaslessBadge deployed to:", address);
  console.log("Network:", hre.network.name);
  
  // Verify instructions
  console.log(`\nTo verify the contract on Basescan:`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${address} "${deployer.address}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
