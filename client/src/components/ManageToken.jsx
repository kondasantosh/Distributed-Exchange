import  React from "react";

function ManageToken(){
    return(
        <div  className="Contact">
            <div class="container">
                <div class="row align-items-center my-5">
                    <div class="col-lg-7">
                        <h1>Manage Token</h1>
                         <p>This page is intended for the FIXED Token as sample only. You can send token and you can approve token.
                             <br/>
                            Additionally you can add a token to the exchange provided in this example.
                        </p>
                        <h3>You have  TOKEN in your account</h3>
                    </div>
                    <div class="col-lg-4" >
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