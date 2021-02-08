
var Token = artifacts.require("./MyToken.sol");

module.exports = function(deployer) {
 
  
  deployer.deploy(Token,100000);
  
};
