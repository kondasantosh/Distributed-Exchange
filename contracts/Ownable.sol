pragma solidity ^0.7.0;

contract Owner {
   address owner;
   constructor() public {
      owner = msg.sender;
   }
   modifier onlyOwner {
      require(msg.sender == owner,"Not owner");
      _;
   }
}

     
