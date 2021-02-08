var Migrations = artifacts.require("./Exchange.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations,1000);
};
