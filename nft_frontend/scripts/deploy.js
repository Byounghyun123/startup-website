const hre = require("hardhat");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  //** ethers v6 */
  await nftMarketplace.waitForDeployment();
  console.log('deployed contract Address: ', await nftMarketplace.getAddress());

  // //TRANSFER FUNDS
  // const TransferFunds = await hre.ethers.getContractFactory("TransferFunds");
  // const transferFunds = await TransferFunds.deploy();

  //** ethers v5 */
  // await nftMarketplace.deployed();
  // console.log(` deployed contract Address ${nftMarketplace.address}`);

  // await transferFunds.deployed();
  // console.log(` deployed contract Address ${transferFunds.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
