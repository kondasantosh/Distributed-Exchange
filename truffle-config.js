const path = require("path");

const AccountIndex=0; 

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
      host:"127.0.0.1",
      network_id :"*" ,
    },
    
  },
  compilers:{
    solc:{
      version:"^0.7.0",
    }
  }
};
