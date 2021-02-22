import  React from "react";
import App from "../App";


function ManageToken(props){

    
    
    return(
        <div  className="ManageToken">
            <div class="container-fluid">
                <div class="row ">
                    <div class="col-lg-8">
                        <h1>Manage Token </h1>
                         <p>This page is intended for the FIXED Token as sample only. You can send token and you can approve token.
                             <br/>
                            Additionally you can add a token to the exchange provided in this example.
                        </p>
                        <h3>You have {props.state.NTokens} TOKEN in your account</h3>
                        <div class="row">
                             <div class="col-lg-6">
                                 <div class=" card">
                                     <div class="card-header bg-primary text-white">Send Token</div>
                                     <div class="card-body ">
                                         <form>
                                             <div class="form-group">
                                                 <lable for="inputAmountSendToken">Amount in Token</lable>
                                                 <input type="text" name="InputAmountSendToken" class="form-control"  value={props.state.TokenValue}  onChange={props.InputHandleChangeForValue}></input>
                                             </div>
                                             <div class="form-group">
                                                 <lable for="inputBeneficiarySendToken">To Address</lable>
                                                 <input type="text" name="InputBeneficiarySendToken" class="form-control" value={props.state.Reciepent} onChange={props.InputHandleChangeForText}></input>
                                             </div>
                                             <button type="button" class="btn btn-primary" onClick={props.TokenTransfer} >Send Token</button>
                                         </form>
                                     </div>
                                     <div class="card-footer">Directly send a token from your address to another address.</div>
                                 </div> 
                             </div>
                             <div class="col-lg-6">
                                 <div class=" card">
                                     <div class="card-header bg-primary text-white">Approve Token Allowance</div>
                                     <div class="card-body">
                                         <form>
                                             <div class="form-group">
                                                 <lable for="inputAmountAllowanceToken">Amount in Token</lable>
                                                 <input type="text" name="inputAmountAllowanceToken" class="form-control" value={props.state.AllowanceToken}  onChange={event=>props.MainApp.setState({AllowanceToken:event.target.value})}></input>
                                             </div>
                                             <div class="form-group">
                                                 <lable for="inputBeneficiaryAllowanceToken">To Address</lable>
                                                 <input type="text" name="InputBeneficiarySendToken" class="form-control" value={props.state.AllowanceAddress} onChange={event=>props.MainApp.setState({AllowanceAddress:event.target.value})}></input>
                                             </div>
                                             <button type="button" class="btn btn-primary" onClick={props.ApproveToken}>Allow Token to be used</button>
                                         </form>
                                     </div>
                                     <div class="card-footer">Approve the address <i>to be allowed</i> to send a token from your
                            address to another address. This is important for the Exchange. When you fund the token in
                            the exchange then it will deduct in your name the token from your address to the token
                            address.</div>
                                 </div> 
                             </div>

                    </div> 
                    <br/>  
                    <div class="card">
                                     <div class="card-header bg-primary text-white">Add Token to Exchange</div>
                                     <div class="card-body">
                                         <form>
                                             <div class="form-group">
                                                 <lable for="inputNameTokenAddExchange">Name of the Token</lable>
                                                 <input type="text" name="AddTokenToExchangeName" class="form-control"  value={props.state.NameOfToken} onChange={event=>props.MainApp.setState({NameOfToken:event.target.value})}></input>
                                             </div>
                                             <div class="form-group">
                                                 <lable for="inputBeneficiaryAllowanceToken">Address of Token</lable>
                                                 <input type="text" name="AddressOfTheToken" class="form-control" value={props.state.AddressOfToken} onChange={event=>props.MainApp.setState({AddressOfToken:event.target.value})}></input>
                                             </div>
                                             <button type="button" class="btn btn-primary" onClick={props.MainApp.AddTokenToExchange}>Add Token to Exchange</button>
                                         </form>
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
export default ManageToken;