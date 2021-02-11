import React, { Component } from "react";
import Exchange from "./contracts/Exchange.json";
import Token from "./contracts/MyToken.json";
import getWeb3 from "./getWeb3";
import logo from './logo.svg';
import "./App.css";


import { BrowserRouter as Router, Route,Link, Switch } from "react-router-dom";
import { Navigation, Footer, Home, About, ManageToken } from "./components";


  const Hoe=()=>{
    return(<h3>home</h3>);
  };

class App extends Component {
  state = { CurrentAddress:"0X123" ,Load:false, NTokens:0,balance:0,Reciepent:"0x123",TokenValue:0,NameOfToken:"",AddressOfToken:"",Tokenevent:"",WithDrawEther:0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
      

      this.ExchangeInstance=new this.web3.eth.Contract(
        Exchange.abi,
        Exchange.networks[this.networkId] && Exchange.networks[this.networkId].address,
      );

      this.TokenInstance=new this.web3.eth.Contract(
        Token.abi,
        Token.networks[this.networkId]&&Token.networks[this.networkId].address,
      );
      
      

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ CurrentAddress : Token.networks[this.networkId].address,Load: true,  },this.handleBalanceEther);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  ///////////////
  //ManageToken//
  //////////////
  handleDepositEther=async ()=>{
    await this.ExchangeInstance.methods.depositEther().send({from:this.accounts[0],value:this.web3.utils.toWei("0.05", "ether")});
    this.handleBalanceEther();
  }

  handleWithDrawEther=async()=>{
    await this.ExchangeInstance.methods.withdrawEther({value:this.web3.utils.toWei(this.state.WithDrawEther,"ether")}).call();
    this.handleBalanceEther();
  }
  handleBalanceEther=async()=>{
    let balance=await this.ExchangeInstance.methods.getEthBalanceInWei().call({from:this.accounts[0]});
    this.setState({balance:balance});
  }

  UpdateUserToken=async ()=>{
    let usertoken=await this.TokenInstance.methods.balanceOf(this.accounts[0]).call({from:this.accounts[0]});
    console.log(usertoken);
    this.setState({NTokens:usertoken});
  }
    TransferToken=async ()=>{
   
    const {Reciepent,TokenValue}=this.state;
    let tokenInstancesend= await this.TokenInstance.methods.transfer(Reciepent,TokenValue).send({from:this.accounts[0]});
    this.UpdateUserToken();
    console.log(tokenInstancesend);
    
 }

 DepositToken=async()=>{
  await this.ExchangeInstance.methods.depositToken().call()
 }

 WithDrawToken=async()=>{
  await this.ExchangeInstance.methods.withToken().call()
 }

 InputHandleChangeForText=(event)=>{
  const target=event.target;
  const value=target.type==="checkBox" ? target.checked: target.value;
  

   this.setState({Reciepent:value});
   
 }
 
 InputHandleChangeForValue=(event)=>{
  const target=event.target;
  const value=target.type==="checkBox" ? target.checked: target.value;
  
  this.setState({TokenValue:value});
 
}

ApproveAccount=async()=>{
  await this.TokenInstance.methods.approve(this.state.Reciepent,this.state.TokenValue).send({from :this.accounts[0]});
  this.UpdateUserToken();
}

 AddTokenToExchange=async()=>{
   await this.ExchangeInstance.methods.addToken(this.state.NameOfToken,this.state.AddressOfToken).call({from:this.address[0]});

 }  
 //eventlistnerwrong//
 EventListener=async()=>{
   let evnt=await this.TokenInstance.events.Transfer({to:this.accounts[0]}).on("data",this.updateusertoken);
   this.setState({Tokenevent:evnt})
   const results= await this.TokenInstance.getPastEvents('events',{fromBlock:0});
   console.log(results);
 }
  
/*
    <h3>
        {this.state.NTokens}
      </h3>
      <h3>
      {this.state.CurrentAddress}
      </h3>
      <h3>
        {this.state.balance}
      </h3>
      <h3>
        //
        {this.state.Tokenevent}
      </h3>
      <form>
      <span> Reciepent Address</span> <input type="text"   value={this.state.Reciepent} onChange={this.InputHandleChangeForText} />
      <span>Value</span><input type="text"  value={this.state.TokenValue}  onChange={this.InputHandleChangeForValue}/>
      </form>
      <button type="button" onClick={this.handleDepositEther}>deposit Ether</button>
      <button type="button" onClick={this.handleBalanceEther}>Balance</button>
      <button type="button" onClick={this.UpdateUserToken}>Token</button>
      <button type="button" onClick={this.TransferToken}>BuyToken</button>
  
*/

 

  
  render() {
    if (!this.state.Load) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        
      
      
    <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/About" exact component={() => <About />} />
          <Route path="/ManageToken" exact component={() => <ManageToken />} />
        </Switch>
        <Footer />
      </Router>
    
      </div>
      
    );
  }
}

export default App;
