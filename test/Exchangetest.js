const Token = artifacts.require("./MyToken.sol");
const Exchange = artifacts.require("./Exchange.sol");

const { assert } = require("chai");
const chai = require("chai");
const BN = web3.utils.BN;
var expect = chai.expect;
const chaiBN = (require('chai-bn'))(BN);
chai.use(chaiBN);
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


contract("Exchange", accounts => {
  const [initialHolder,recepient,accountholder]=accounts;
  
   

  

 it("It should have 1000000", async () => {
    this.myToken = await Token.deployed(100000000);
    let Instance=this.myToken;
    // Set value of 89
   let totalSupply=await Instance.totalSupply();
   
   return expect(Instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it("It should deposit ether and withdraw ether",async()=>{
    let Instance=await Exchange.deployed();
     let deposit=await Instance.depositEther({value: web3.utils.toWei("1","ether")});
    
    
    await Instance.withdrawEther(web3.utils.toWei("1","ether"));
    let balance=await Instance.getEthBalanceInWei({from:initialHolder});
    //console.log(balance);
    return expect(balance.toNumber()).to.be.equal(0);
    
  });

  it("It should able to deposit token and withdraw token",async()=>{
    let Instance=await Exchange.deployed();
    this.token=await Token.deployed();
   
    //console.log(approve);
    let addToken=await Instance.addToken("DE",(this.token).address);
    //console.log(addToken);
    let approve=await  this.token.approve(Instance.address,2000);
    //console.log(approve);
    let deposit=await Instance.depositToken("DE",2000);
    
    //let balance1=await Instance.getBalance("DE");
    //console.log(balance1);

    let withdraw=await Instance.withToken("DE",1900);
   // console.log(withdraw);
    let balance1=await Instance.getBalance("DE");
    //let balance2=await this.token.balanceOf();
   // console.log(balance2);
   return expect(balance1.toNumber()).to.be.equal(100);


  });

  it("It should able to buytoken",async()=>{
    let Instance =await Exchange.deployed();
    this.token=await Token.deployed();
    
    await Instance.depositEther({from:accounts[0],value:web3.utils.toWei("3","ether")});
    
    //let addToken=await Instance.addToken("DE",(this.token).address);
    //console.log(addToken);
   // let approve=await  this.token.approve(Instance.address,2000);
    //console.log(approve);
    //await Instance.depositToken("DE",2000);
   var orderBook=await Instance.getBuyOrderBook("DE");
  // console.log(orderBook[0].length);
   
     expect(orderBook).to.have.all.keys('0','1');
     expect(orderBook[0]).to.have.lengthOf(0);
   // assert.equal(orderBook.length ,"2", "BuyOrderBook should have 2 elements");
   //assert.equal(orderBook[0].length, 0, "OrderBook should have 0 buy offers")
    Buytoken=await Instance.buyToken("DE",web3.utils.toWei("3","wei"),3);
   // console.log(Buytoken);
   orderBook=await Instance.getBuyOrderBook("DE");
   
   console.log(orderBook[1][0]);
    expect(Buytoken.logs).to.have.lengthOf(1,"they should have one Log Message emitted. ");
    expect(Buytoken.logs[0].event).to.have.string("LimtBuyOrderCreated");
    expect(orderBook[0]).to.have.lengthOf(1,"equal to 1");
    expect(orderBook[1]).to.have.lengthOf(1,"equal to 1");
   // expect(orderBook[1][0]).to.be.evetually.equal(new BN(3));
   assert.equal(orderBook[1][0],3,"order book not eqaul to 3");
    //expect(orderBook[1][0]).to.be.equal(new BN(3));
    let selltoken=await Instance.sellToken("DE",web3.utils.toWei("3","wei"),3);
   console.log(selltoken);
   expect(selltoken.logs).to.have.lengthOf(1,"they should have one Log Message emitted. ");
   expect(selltoken.logs[0].event).to.have.string("LimitSellOrderCreated");
   orderBook=await Instance.getBuyOrderBook("DE");
   //console.log(orderBook);
   assert(orderBook[0],0,"not empty");
   assert(orderBook[1],0)

    //expect(orderBook[1]).to.be.empty;
   //let sellBook=await Instance.getSellOrderBook("DE");
   //console.log(sellBook);
   //expect(sellBook[0]).to.have.lengthOf(0,"equal to 1");
    //expect(sellBook[1]).to.have.lengthOf(0,"equal to 1");
    //console.log(selltoken);
    
    
  });

  it("Should be able to canceltokens",async()=>{
    let Instance=await Exchange.deployed();
    let token=await Token.deployed();
    await Instance.depositEther({from:accounts[0],value:web3.utils.toWei("3","ether")});
    let buytoken=await Instance.buyToken("DE",web3.utils.toWei("3","wei"),3);
    //console.log(buytoken);
    let BuyOrderBook=await Instance.getBuyOrderBook("DE");
    let BuyOrderBookbeforecancel=BuyOrderBook[0].length;
    console.log(buytoken.logs[0].args.offerlength);
    let index=await Instance. getsymbolIndex("DE");
    
    let numberoftokens=await Instance.getBalance("DE");
    //console.log(numberoftokens);
    let cancelorder=await Instance.cancelOrder("DE",false,web3.utils.toWei("3","wei"),buytoken.logs[0].args.offerlength);
    console.log(cancelorder);
    BuyOrderBook=await Instance.getBuyOrderBook("DE")
    let BuyOrderBookaftercancel=BuyOrderBook[0].length;
    assert.equal(BuyOrderBookaftercancel,BuyOrderBookbeforecancel);



  });

  

});
