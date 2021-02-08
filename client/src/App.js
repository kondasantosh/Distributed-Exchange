import React, { Component } from "react";
import Exchange from "./contracts/Exchange.json";
import Token from "./contracts/MyToken.json";
import getWeb3 from "./getWeb3";
import logo from './logo.svg';
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Home, About, ManageToken } from "./components";

class App extends Component {
  state = { CurrentAddress:"0X123" ,Load:false, NTokens:0,balance:0};

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
      
      this.ListenToTokensTransfer();

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

  //ManageToken//

  handleDepositEther=async ()=>{
    await this.ExchangeInstance.methods.depositEther().send({from:this.accounts[0],value:this.web3.utils.toWei("0.05", "ether")});
  }

  handleBalanceEther=async()=>{
    let balance=await this.ExchangeInstance.methods.getEthBalanceInWei().call({from:this.accounts[0]});
    this.setState({balance:balance});
  }

  UpdateUserToken=async ()=>{
    let usertoken=await this.TokenInstance.methods.totalSupply().call({from:this.accounts[0]});
    console.log(usertoken);
    this.setState({NTokens:usertoken});
  }
  ListenToTokensTransfer=async ()=>{
    await this.TokenInstance.methods.BuyToken().send({from:this.accounts[0],value:1});
 }


  
  render() {
    if (!this.state.Load) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <h3>
        {this.state.NTokens}
      </h3>
      <h3>
      {this.state.CurrentAddress}
      </h3>
      <h3>
        {this.state.balance}
      </h3>
    
      <button type="button" onClick={this.handleDepositEther}>deposit Ether</button>
      <button type="button" onClick={this.handleBalanceEther}>Balance</button>
      <button type="button" onClick={this.UpdateUserToken}>Token</button>
      <button type="button" onClick={this.ListenToTokensTransfer}>BuyToken</button>
     
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
