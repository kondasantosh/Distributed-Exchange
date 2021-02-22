import  React from "react";

function ExchangeOverview(props){
    return(
        <div  className="home">
           <div  class="container-fluid">
               <div class="row">
                   <div class="col-lg-8">
                   <h1>Distributed Token Exchange</h1>
            <h3>You have <span class="black"><span >{props.Token}</span> DE TOKEN</span> in the
                exchange</h3>
            <h3>You have <span class="black"><span >{props.balance}</span> WEI</span> in the exchange</h3>
            <hr />
            <h3>Deposit</h3>
            <div class="row">
                <div class="col-lg-6">
                <div class=" card">
                  <div class="card-header bg-primary text-white">Deposit Token</div>
                    <div class="card-body ">
                     <form>
                          <div class="form-group">
                           <lable for="inputAmountSendToken">SymbolName</lable>
                              <input type="text" name="InputAmountSendToken" class="form-control" value={props.MainApp.state.DSymbol} onChange={event=>props.MainApp.setState({DSymbol:event.target.value})}></input>
                                  </div>
                                   <div class="form-group">
                                     <lable for="inputBeneficiarySendToken">Amount in Token</lable>
                                       <input type="text" name="InputBeneficiarySendToken" class="form-control"  value={props.MainApp.state.DepositToken} onChange={event=>props.MainApp.setState({DepositToken:event.target.value})}></input>
                                  </div>
                              
                      </form>
                        </div>
                    <div class="card-footer"><button type="button" class="btn btn-primary" onClick={props.MainApp.DepositToken} >Deposit Token</button></div>
                </div> 
                </div>
                <div class="col-lg-6">
                <div class=" card">
                  <div class="card-header bg-primary text-white">Deposit Ether</div>
                    <div class="card-body ">
                     <form>
                          <div class="form-group">
                           <lable for="inputAmountSendToken">Amount in Ether</lable>
                              <input type="text" name="InputAmountSendToken" class="form-control"  value={props.MainApp.state.DepositEther} onChange={event=>props.MainApp.setState({DepositEther:event.target.value})}></input>
                                  </div>
                                  
                              
                      </form>
                        </div>
                    <div class="card-footer"><button type="button" class="btn btn-primary" onClick={props.MainApp.handleDepositEther}  >Deposit Ether</button></div>
                </div> 
                </div>

            </div>

            <hr />
            <h3>WithDraw</h3>
            <div class="row">
                <div class="col-lg-6">
                <div class=" card">
                  <div class="card-header bg-primary text-white">WithDraw Token</div>
                    <div class="card-body ">
                     <form>
                          <div class="form-group">
                           <lable for="inputAmountWithDrawToken">SymbolName</lable>
                              <input type="text" name="InputAmountWithDrawToken" class="form-control" value={props.MainApp.state.WSymbol} onChange={event=>props.MainApp.setState({WSymbol:event.target.value})} ></input>
                                  </div>
                                   <div class="form-group">
                                     <lable for="inputBeneficiaryWithDrawToken">Amount in Token</lable>
                                       <input type="text" name="InputBeneficiaryWithDrawToken" class="form-control"  value={props.MainApp.state.WithDrawToken} onChange={event=>props.MainApp.setState({WithDrawToken:event.target.value})} ></input>
                                  </div>
                              
                      </form>
                        </div>
                    <div class="card-footer"><button type="button" class="btn btn-primary"  onClick={props.MainApp.WithDrawToken}>Withdraw Token</button></div>
                </div> 
                </div>
                <div class="col-lg-6">
                <div class=" card">
                  <div class="card-header bg-primary text-white">WithDraw Ether</div>
                    <div class="card-body ">
                     <form>
                          <div class="form-group">
                           <lable for="inputAmountWithdrawEther">Amount in Ether</lable>
                              <input type="text" name="InputAmountWithdrawEther" class="form-control" value={props.MainApp.state.WithDrawEther} onChange={event=>props.MainApp.setState({WithDrawEther:event.target.value})} ></input>
                                  </div>
                                  
                              
                      </form>
                        </div>
                    <div class="card-footer"><button type="button" class="btn btn-primary"  onClick={props.MainApp.handleWithDrawEther} >WithDraw Ether</button></div>
                </div> 
                </div>
                

            </div>
            <br/>
                    <br/>
                    <br/>
                    <br/>

                   </div>
                   <div class="col-lg-8" style={{flex: 1,backgroundColor: '#808080'}}>
                        <br/>
                        <h3>Events from the Token Contract</h3>                    
                        
                        <h3>Status from our Javascript</h3>
                        
                        <h3>Important Information</h3>  
                    </div> 

                    
               </div>

           </div>
        </div>
    );
}
export default ExchangeOverview;