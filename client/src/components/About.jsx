import  React from "react";

function About(props){
    return(
        <div  className="About">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-8">
                    <h1>Distributed Token Exchange</h1>
                    <p>Here you can trade the FIXED token we discuss during our course. The Solidity Contract is not limited to a single token and new tokens can be easily added.</p>
                    <h3>New Order</h3>
                    <div class="row">
                        <div class="col-lg-6">
                        <div class=" card">
                              <div class="card-header bg-success text-white">Buy Token</div>
                                <div class="card-body ">
                                <form>
                                <div class="form-group">
                                <lable for="inputAmountBuyToken">SymbolName</lable>
                                <input type="text" name="InputAmountBuyToken" class="form-control"  ></input>
                                </div>
                                   <div class="form-group">
                                   <lable for="inputBeneficiaryBuyToken">Price in Wei</lable>
                                   <input type="text" name="InputBeneficiaryBuyToken" class="form-control" ></input>
                                   </div>
                              
                                   </form>
                                   </div>
                                   <div class="card-footer"><button type="button" class="btn  bg-success : hover text-white" onClick={props.MainApp.BuyToken} >Buy Token</button></div>
                                   </div> 

                        </div>
                        <div class="col-lg-6">
                        <div class=" card">
                              <div class="card-header bg-danger text-white">Sell Token</div>
                                <div class="card-body ">
                                <form>
                                <div class="form-group">
                                <lable for="inputAmountBuyToken">SymbolName</lable>
                                <input type="text" name="InputAmountBuyToken" class="form-control"  ></input>
                                </div>
                                   <div class="form-group">
                                   <lable for="inputBeneficiaryBuyToken">Price in Wei</lable>
                                   <input type="text" name="InputBeneficiaryBuyToken" class="form-control" ></input>
                                   </div>
                              
                                   </form>
                                   </div>
                                   <div class="card-footer"><button type="button" class="btn btn-danger" onClick={props.MainApp.SellToken} >Sell Token</button></div>
                                   </div> 

                                   </div>


                    </div>
                    <br/>
                    <h3>Order Book</h3>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-header bg-danger ">
                                    <div class="card-title text-white">
                                    BID
                                    </div>
                                </div>
                                <div class="card-body"></div>                        
                            </div>

                        </div>
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title">
                                    Ask
                                    </div>
                                </div>
                                <div class="card-body"></div>                        
                            </div>

                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>

                    </div>
                    
                  
                   <div class="col-lg-4" style={{backgroundColor: '#808080'}}>
                        <br/>
                        <h3>Your Assets</h3>    
                        <div><span ></span> DE Token</div>
                        <div><span ></span> ETHER</div>                
                        <h3>Fulfilled Orders</h3>
                        <div ></div>
                        <h3>Limit Orders</h3>
                        <div ></div>  
                        <h3>Status from our Javascript</h3>
                        <span></span>
                        <h3>Important Information</h3>
                        <span></span>
                    </div> 
                    
                </div>
                
            </div>
            
        </div>
    );
}
export default About;