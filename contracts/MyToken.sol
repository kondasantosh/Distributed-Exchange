pragma solidity >=0.6.0 <0.8.0;


import "../client/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.SOL";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply)ERC20("Distributed exchange","DE") public{
        _mint(msg.sender,initialSupply);
        _setupDecimals(0);
    }

    
}