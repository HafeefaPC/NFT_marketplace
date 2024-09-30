// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployModule = buildModule('TokenModule', (m) => {
  const marketplace = m.contract('NFTSTORE');
  return marketplace;
})
module.exports = DeployModule;