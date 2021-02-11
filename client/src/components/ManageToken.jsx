import  React from "react";
import App from "../App";


function ManageToken(){
    return(
        <div  className="ManageToken">
            <div class="container">
                <div class="row ">
                    <div class="col-lg-8">
                        <h1>Manage Token</h1>
                         <p>This page is intended for the FIXED Token as sample only. You can send token and you can approve token.
                             <br/>
                            Additionally you can add a token to the exchange provided in this example.
                        </p>
                        <h3>You have  TOKEN in your account</h3>
                        <div class="row">
                             <div class="col-lg-6">
                                 <div class=" card">
                                     <div class="card-header bg-primary text-white">Send Token</div>
                                     <div class="card-body ">
                                         <form>
                                             <div class="form-group">
                                                 <lable for="inputAmountSendToken">Amount in Token</lable>
                                                 <input type="text" name="InputAmountSendToken" class="form-control"  ></input>
                                             </div>
                                             <div class="form-group">
                                                 <lable for="inputBeneficiarySendToken">To Address</lable>
                                                 <input type="text" name="InputBeneficiarySendToken" class="form-control"></input>
                                             </div>
                                             <button type="button" class="btn btn-primary" >Send Token</button>
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
                                                 <input type="text" name="inputAmountAllowanceToken" class="form-control"></input>
                                             </div>
                                             <div class="form-group">
                                                 <lable for="inputBeneficiaryAllowanceToken">To Address</lable>
                                                 <input type="text" name="InputBeneficiarySendToken" class="form-control"></input>
                                             </div>
                                             <button type="button" class="btn btn-primary">Allow Token to be used</button>
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
                                     <div class="card-header bg-primary text-white">Approve Token Allowance</div>
                                     <div class="card-body">
                                         <form>
                                             <div class="form-group">
                                                 <lable for="inputNameTokenAddExchange">Name of the Token</lable>
                                                 <input type="text" name="inputAmountAllowanceToken" class="form-control"></input>
                                             </div>
                                             <div class="form-group">
                                                 <lable for="inputBeneficiaryAllowanceToken">Address of Token</lable>
                                                 <input type="text" name="InputBeneficiarySendToken" class="form-control"></input>
                                             </div>
                                             <button type="button" class="btn btn-primary">Add Token to Exchange</button>
                                         </form>
                                     </div>
                                     
                                     
                     </div>
                                    <br/>
                                     <br/>
                                     <br/>
                                     <br/>
                        
                </div>
                <div class="card" style={{flex: 1,backgroundColor: '#808080'}}>
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