pragma solidity >=0.6.0 <0.8.0;

import "./Ownable.sol";
import "./MyToken.sol";
import "../client/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.SOL";
contract Exchange is Owner{

  constructor(uint256 initial) public{

  }
    struct offer{

        uint amount;
        address who;

    }
    struct orderBook{
        uint higherPrice;
        uint lowerPrice;
        mapping(uint => offer) offers;
        uint offer_key;
        uint offer_length;

    }
    struct Token{

        address tokenContract;
        string symbolName;

        mapping(uint =>orderBook) buyBook;
        uint curBuyPrice;
        uint lowestBuyprice;
        uint amountBuyPrice;

        mapping(uint =>orderBook) sellBook;
        uint curSellPrice;
        uint highestSellprice;
        uint amountSellPrice;

    }

    mapping (uint8=>Token) token;
    uint8 symbolNameIndex;

    mapping (address=>mapping(uint8 =>uint)) TokenBalanceAddress;
    mapping(address =>uint) balanceEtherAddress;


    ///Events  FOR WITHDRAWAL AND DEPOSITS///

    event DepositTokenEmit(address indexed _from,uint indexed _amount,uint indexed _symbolindex,uint _timestamp);
    event WithdrawTokenEmit(address indexed _To,uint indexed _amount,uint indexed _symbolindex,uint _timestamp);
    event DepositEtherEmit(address indexed _from,uint _amount,uint _timestamp);
    event WithEtherEmit(address indexed _To,uint _amount,uint _timestamp);
    //event for orders//
    event LimtBuyOrderCreated(int indexed index,uint  _priceinwei,uint  _amounttoken,address indexed who,uint indexed offerlength);
    event LimitSellOrderCreated(int indexed index,uint _priceinwei,uint _amounttoken,address indexed who, uint indexed offerlength);
    event SellOrderCancelled(int indexed index,uint indexed _priceinwei,uint _offerkey);
    event BuyOrderCancelled(int indexed index,uint indexed _priceinwei,uint _offerkey);
    event SellOrderFulfilled(uint indexed _symbolIndex, uint _amount, uint _priceInWei, uint _orderKey);
    /////////////////////////
    //Deposit and Withdraw//
    ///////////////////////

    function depositEther() public payable{
        require(balanceEtherAddress[msg.sender]+msg.value>=balanceEtherAddress[msg.sender]);
        balanceEtherAddress[msg.sender]+=msg.value;
        emit DepositEtherEmit(msg.sender,msg.value,block.timestamp);

    }

    function withdrawEther(uint amountInWei) public{
            require((balanceEtherAddress[msg.sender]-amountInWei)>=0,"You dont have  enough balance");
            require(amountInWei>0);
            (msg.sender).transfer(amountInWei);
            balanceEtherAddress[msg.sender]-=amountInWei;
            WithEtherEmit(msg.sender,amountInWei,block.timestamp);
    }

    function getEthBalanceInWei() public view returns(uint256){
            return balanceEtherAddress[msg.sender];
        
    }


    ////////////////////////
    //Token Management/////
    //////////////////////
    function addToken(string memory symbolName,address erc20TokenAddress) public onlyOwner{
        require(!hasToken(symbolName),"Already have it");
        symbolNameIndex++;
        token[symbolNameIndex].symbolName=symbolName;
        token[symbolNameIndex].tokenContract=erc20TokenAddress;

    }
    function hasToken(string memory symbolName) public view  returns(bool){
        uint index = getsymbolIndex(symbolName);
        if(index==0){
            return false;
        }

        return true;

    }

    function getsymbolIndex(string memory symbolName) public view returns(uint8){

        for(uint8 i=0;i<=symbolNameIndex;i++)
        {
            if(stringEqual(token[i].symbolName,symbolName)){
                return i;
            }
        }

        return 0;
    }

    function getSymbolIndexOrThrow(string memory symbol) public view returns(uint8){
        uint8 Index=getsymbolIndex(symbol);
        require(Index>0,"Index is less than 0");
        return(Index);
    }


    //////////////////////////
    ///STRING COMPARISON/////
    ////////////////////////
    function stringEqual(string memory _a,string memory _b) public view returns(bool){
        bytes memory a= bytes(_a);
        bytes  memory b=bytes(_b);
        if(a.length!=b.length){
            return false;
        }

        for(uint i=0;i<a.length;i++){
            if(a[i]!=b[i]){
                return false;
            }
        }

        return true;
    }
    ///////////////////////////
    ///deposit and Withdraw////
    //////////////////////////
    function depositToken(string memory symbolName,uint amount) public{
        uint8 symbolNameIndex=getSymbolIndexOrThrow(symbolName);
        require(token[symbolNameIndex].tokenContract!=address(0),"address problem");
        ERC20 token=ERC20(token[symbolNameIndex].tokenContract);
        require(token.transferFrom(msg.sender,address(this),amount)==true,"token transfer failed");
        require(TokenBalanceAddress[msg.sender][symbolNameIndex]+amount>=TokenBalanceAddress[msg.sender][symbolNameIndex],"tokenbalanceadrresss+amount fail");
        TokenBalanceAddress[msg.sender][symbolNameIndex]+=amount;
        emit DepositTokenEmit(msg.sender,symbolNameIndex,amount,block.timestamp);
        

    }
    function withToken(string memory symbolName,uint amount ) public {
         uint8 symbolNameIndex=getSymbolIndexOrThrow(symbolName);
        require(token[symbolNameIndex].tokenContract!=address(0));
        ERC20 token=ERC20(token[symbolNameIndex].tokenContract);
        require(TokenBalanceAddress[msg.sender][symbolNameIndex]>=0);
        require(TokenBalanceAddress[msg.sender][symbolNameIndex]-amount<=TokenBalanceAddress[msg.sender][symbolNameIndex]);
        require(token.transfer(msg.sender,amount));
        TokenBalanceAddress[msg.sender][symbolNameIndex]-=amount;
        emit WithdrawTokenEmit(msg.sender,amount,symbolNameIndex,block.timestamp);

    }
    function getBalance(string memory symbolName) view public  returns(uint){
         uint8 symbolNameIndex=getSymbolIndexOrThrow(symbolName);

        return TokenBalanceAddress[msg.sender][(symbolNameIndex)];

    }
    
   

    /////////////////////////
    //ORDER BOOK -BID ORDER//
    ////////////////////////
    function getBuyOrderBook(string memory symbolName) view public  returns(uint[] memory ,uint[] memory )
    {
        uint8 tokenNameIndex = getSymbolIndexOrThrow(symbolName);
        uint[] memory arrPricesBuy = new uint[](token[tokenNameIndex].amountBuyPrice);
        uint[] memory arrVolumesBuy = new uint[](token[tokenNameIndex].amountBuyPrice);

        uint whilePrice = token[tokenNameIndex].lowestBuyprice;
        uint counter = 0;
        if (token[tokenNameIndex].curBuyPrice > 0) {
            while (whilePrice <= token[tokenNameIndex].curBuyPrice) {
                arrPricesBuy[counter] = whilePrice;
                uint volumeAtPrice = 0;
                uint offers_key = 0;

                offers_key = token[tokenNameIndex].buyBook[whilePrice].offer_key;
                while (offers_key <= token[tokenNameIndex].buyBook[whilePrice].offer_length) {
                    volumeAtPrice += token[tokenNameIndex].buyBook[whilePrice].offers[offers_key].amount;
                    offers_key++;
                }

                arrVolumesBuy[counter] = volumeAtPrice;

                //next whilePrice
                if (whilePrice == token[tokenNameIndex].buyBook[whilePrice].higherPrice) {
                    break;
                }
                else {
                    whilePrice = token[tokenNameIndex].buyBook[whilePrice].higherPrice;
                }
                counter++;

            }
        }

      
        return (arrPricesBuy, arrVolumesBuy);


    }
        
    

    ////////////////////////
    //ORDER BOOK-ASK ORDER//
    ////////////////////////


    function getSellOrderBook(string memory symbolName) view   public  returns(uint[] memory,uint[] memory) {
        uint8 tokenNameIndex = getSymbolIndexOrThrow(symbolName);
        uint[] memory arrPricesSell = new uint[](token[tokenNameIndex].amountSellPrice);
        uint[] memory arrVolumesSell = new uint[](token[tokenNameIndex].amountSellPrice);
        uint whilePrice = token[tokenNameIndex].curSellPrice;
        uint counter = 0;
        
        if (token[tokenNameIndex].curSellPrice >0){
            
             while (whilePrice <= token[tokenNameIndex].highestSellprice){
                
                arrPricesSell[counter] = whilePrice;
                uint volumeAtPrice = 0;
                uint offers_key = 0;
                offers_key = token[tokenNameIndex].sellBook[whilePrice].offer_key;
                while (offers_key <= token[tokenNameIndex].sellBook[whilePrice].offer_length) {
                    volumeAtPrice += token[tokenNameIndex].sellBook[whilePrice].offers[offers_key].amount;
                    offers_key++;
                    
                }
                 arrVolumesSell[counter] = volumeAtPrice;
                  //next whilePrice
                if (token[tokenNameIndex].sellBook[whilePrice].higherPrice==0) {
                    break;
                }
                else {
                    whilePrice = token[tokenNameIndex].sellBook[whilePrice].higherPrice;
                }
                counter++;
                


             }


        }
        return (arrPricesSell, arrVolumesSell);

    
    }

    /////////////////////////
    //NEW ORDER -BID ORDER//
    ///////////////////////

    function  buyToken(string memory symbolName,uint priceInWei,uint amount) public{
        uint8 TokenNameIndex=getSymbolIndexOrThrow(symbolName);
        uint256 AmountInEther_necessary=0;
        uint256 AmountInEther_available=0;
        //if we have enough ether then we can buy it
       

        

        if(token[TokenNameIndex].amountSellPrice == 0||token[TokenNameIndex].curSellPrice>=priceInWei){
             AmountInEther_necessary=priceInWei*amount;
        //overflow Check
        require(AmountInEther_necessary>=amount);
        require(AmountInEther_necessary>=priceInWei);
        require(balanceEtherAddress[msg.sender]>=AmountInEther_necessary);
        require(balanceEtherAddress[msg.sender]-AmountInEther_necessary>=0);
            balanceEtherAddress[msg.sender]-=AmountInEther_necessary;
            addBuyOffer(TokenNameIndex,priceInWei,amount,msg.sender);
            
            emit LimtBuyOrderCreated(TokenNameIndex,priceInWei,amount,msg.sender,token[TokenNameIndex].buyBook[priceInWei].offer_length);
        }else{
             //market order: current sell price is smaller or equal to buy price!

            //1st: find the "cheapest sell price" that is lower than the buy amount  [buy: 60@5000] [sell: 50@4500] [sell: 5@5000]
            //2: buy up the volume for 4500
            //3: buy up the volume for 5000
            //if still something remaining -> buyToken

            //2: buy up the volume
            //2.1 add ether to seller, add symbolName to buyer until offers_key <= offers_length

            uint whilePrice=token[TokenNameIndex].curBuyPrice;
            uint amountnecessary=amount;
            uint offerkey;


            while(whilePrice<=priceInWei && amountnecessary>0){
                offerkey=token[TokenNameIndex].sellBook[whilePrice].offer_key;
                while(offerkey<=token[TokenNameIndex].sellBook[whilePrice].offer_length && amountnecessary>0 ){
                    uint volumeAtPriceFromAddress=token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].amount;
                      //Two choices from here:
                    //1) one person offers not enough volume to fulfill the market order - we use it up completely and move on to the next person who offers the symbolName
                    //2) else: we make use of parts of what a person is offering - lower his amount, fulfill out order.
                    if(volumeAtPriceFromAddress<=amountnecessary){
                        AmountInEther_available=volumeAtPriceFromAddress*whilePrice;
                        require(balanceEtherAddress[msg.sender]>=AmountInEther_available);
                        require(balanceEtherAddress[msg.sender]-AmountInEther_available<=balanceEtherAddress[msg.sender]);
                        balanceEtherAddress[msg.sender]-=AmountInEther_available;
                        require(TokenBalanceAddress[msg.sender][TokenNameIndex]+volumeAtPriceFromAddress>=TokenBalanceAddress[msg.sender][TokenNameIndex]);
                        require(balanceEtherAddress[token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].who]+AmountInEther_available>=balanceEtherAddress[token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].who]);
                        balanceEtherAddress[token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].who]+=AmountInEther_available;
                        TokenBalanceAddress[msg.sender][TokenNameIndex]+=volumeAtPriceFromAddress;
                        token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].amount=0;
                        token[TokenNameIndex].sellBook[whilePrice].offer_key++;
                        
                        SellOrderFulfilled(TokenNameIndex, volumeAtPriceFromAddress,whilePrice, offerkey);

                        amountnecessary-=volumeAtPriceFromAddress;

                    }else{
                        require( token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].amount>amountnecessary);
                        AmountInEther_necessary=whilePrice*amountnecessary;
                        require(balanceEtherAddress[msg.sender]-AmountInEther_necessary<=balanceEtherAddress[msg.sender]);
                        balanceEtherAddress[msg.sender]-=AmountInEther_necessary;
                         require(balanceEtherAddress[token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].who]+AmountInEther_necessary>=balanceEtherAddress[token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].who]);
                         token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].amount-=amountnecessary;
                         balanceEtherAddress[token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].who]+=AmountInEther_necessary;
                          TokenBalanceAddress[msg.sender][TokenNameIndex]+=amountnecessary;
                          amountnecessary=0;
                          SellOrderFulfilled(TokenNameIndex, amountnecessary, whilePrice, offerkey);



                    }
                    
                    if(offerkey==token[TokenNameIndex].sellBook[whilePrice].offer_length && token[TokenNameIndex].sellBook[whilePrice].offers[offerkey].amount==0){
                        token[TokenNameIndex].amountSellPrice--;
                        if(whilePrice==token[TokenNameIndex].sellBook[whilePrice].higherPrice ||token[TokenNameIndex].sellBook[whilePrice].higherPrice==0){
                            token[TokenNameIndex].curSellPrice=0;

                        }else{
                            token[TokenNameIndex].curSellPrice=token[TokenNameIndex].sellBook[whilePrice].higherPrice;
                            token[TokenNameIndex].sellBook[token[TokenNameIndex].sellBook[whilePrice].higherPrice].lowerPrice=0;
                        }
                       
                    }
                     offerkey++;
                }
                whilePrice=token[TokenNameIndex].curSellPrice;

            }
            if(amountnecessary>0){
                buyToken(symbolName, priceInWei, amountnecessary);
            }
        }

        
    }

    /////////////////////////
    //NEW ORDER -ASK ORDER//
    ///////////////////////

    function sellToken(string memory symbolName,uint priceInWei , uint amount) public{
       uint8 TokenNameIndex=getSymbolIndexOrThrow(symbolName);
        uint256 AmountInEther_necessary=0;
        uint256 AmountInEther_available=0;
        require(token[TokenNameIndex].amountBuyPrice == 0 || token[TokenNameIndex].curBuyPrice <= priceInWei,"if condition error");
         if (token[TokenNameIndex].amountBuyPrice == 0 || token[TokenNameIndex].curBuyPrice <= priceInWei){ 
        AmountInEther_necessary=priceInWei*amount;
        require(AmountInEther_necessary>=priceInWei,"problem with AmountInEther_necessary");
        require(AmountInEther_necessary>=amount,"problem with AmountInEther_necessary");
        require(TokenBalanceAddress[msg.sender][TokenNameIndex]>=amount,"problem with Token");
        require(TokenBalanceAddress[msg.sender][TokenNameIndex]-amount>=0,"problem with Token");
        require(balanceEtherAddress[msg.sender]+AmountInEther_necessary>=balanceEtherAddress[msg.sender],"problem with balanceethernecessary");

        TokenBalanceAddress[msg.sender][TokenNameIndex]-=amount;

        addSellOffer(TokenNameIndex,priceInWei,amount,msg.sender);
        emit LimitSellOrderCreated(TokenNameIndex,priceInWei,amount,msg.sender,token[TokenNameIndex].sellBook[priceInWei].offer_length);
         }else{
            //market order: current buy price is bigger or equal to sell price!

            //1st: find the "highest buy price" that is higher than the sell amount  [buy: 60@5000] [buy: 50@4500] [sell: 500@4000]
            //2: sell up the volume for 5000
            //3: sell up the volume for 4500
            //if still something remaining -> sellToken limit order

            //2: sell up the volume
            //2.1 add ether to seller, add symbolName to buyer until offers_key <= offers_length
            uint whilePrice=token[TokenNameIndex].curBuyPrice;
            uint amountnecessary=amount;
            uint offerkey;
            while(whilePrice>=priceInWei && amountnecessary>0){
                offerkey=token[TokenNameIndex].buyBook[whilePrice].offer_key;
                while(offerkey<=token[TokenNameIndex].buyBook[whilePrice].offer_length && amountnecessary>0){
                    uint volumeAtpricefromaddress=token[TokenNameIndex].buyBook[whilePrice].offers[offerkey].amount;
                    //Two choices from here:
                    //1) one person offers not enough volume to fulfill the market order - we use it up completely and move on to the next person who offers the symbolName
                    //2) else: we make use of parts of what a person is offering - lower his amount, fulfill out order.
                    if(amountnecessary>=volumeAtpricefromaddress){
                        AmountInEther_available=volumeAtpricefromaddress*whilePrice;
                        require(TokenBalanceAddress[msg.sender][TokenNameIndex]>=volumeAtpricefromaddress);
                        TokenBalanceAddress[msg.sender][TokenNameIndex]-=volumeAtpricefromaddress;

                        require( TokenBalanceAddress[msg.sender][TokenNameIndex]-volumeAtpricefromaddress>=0);
                        require(TokenBalanceAddress[token[TokenNameIndex].buyBook[priceInWei].offers[offerkey].who][TokenNameIndex]+volumeAtpricefromaddress>TokenBalanceAddress[token[TokenNameIndex].buyBook[priceInWei].offers[offerkey].who][TokenNameIndex]);
                        require(balanceEtherAddress[msg.sender]+AmountInEther_available>=balanceEtherAddress[msg.sender]);

                        TokenBalanceAddress[msg.sender][TokenNameIndex]-=volumeAtpricefromaddress;
                        TokenBalanceAddress[token[TokenNameIndex].buyBook[priceInWei].offers[offerkey].who][TokenNameIndex]+=volumeAtpricefromaddress;
                        token[TokenNameIndex].buyBook[priceInWei].offers[offerkey].amount = 0;
                        balanceEtherAddress[msg.sender]+=AmountInEther_available;
                        token[TokenNameIndex].buyBook[whilePrice].offer_key++;
                        SellOrderFulfilled(TokenNameIndex, volumeAtpricefromaddress,whilePrice, offerkey);
                        amountnecessary-=volumeAtpricefromaddress;


                    }else{
                        require(volumeAtpricefromaddress-amountnecessary>0);
                        AmountInEther_available=volumeAtpricefromaddress*whilePrice;
                        require(TokenBalanceAddress[msg.sender][TokenNameIndex]>=amountnecessary);
                        TokenBalanceAddress[msg.sender][TokenNameIndex]-=amountnecessary;
                          require(balanceEtherAddress[msg.sender]+AmountInEther_available>=balanceEtherAddress[msg.sender]);
                          token[TokenNameIndex].buyBook[priceInWei].offers[offerkey].amount-=amountnecessary;
                          balanceEtherAddress[msg.sender]+=AmountInEther_available;
                          TokenBalanceAddress[token[TokenNameIndex].buyBook[priceInWei].offers[offerkey].who][TokenNameIndex]+=AmountInEther_available;
                          SellOrderFulfilled(TokenNameIndex, volumeAtpricefromaddress,whilePrice, offerkey);

                          amountnecessary=0;
                    }
                    if(offerkey==token[TokenNameIndex].buyBook[whilePrice].offer_length && token[TokenNameIndex].buyBook[priceInWei].offers[offerkey].amount==0 )
                    {
                        token[TokenNameIndex].amountBuyPrice--;
                        if(whilePrice==token[TokenNameIndex].buyBook[whilePrice].lowerPrice || token[TokenNameIndex].buyBook[whilePrice].lowerPrice==0){
                            token[TokenNameIndex].curBuyPrice=0;

                        }else{
                            token[TokenNameIndex].curBuyPrice=token[TokenNameIndex].buyBook[whilePrice].lowerPrice;
                            token[TokenNameIndex].buyBook[token[TokenNameIndex].buyBook[whilePrice].lowerPrice].higherPrice=token[TokenNameIndex].curBuyPrice;
                            

                        }

                    }
                    offerkey++;

                }

                whilePrice=token[TokenNameIndex].curBuyPrice;

            }
            if(amountnecessary>0)
            sellToken(symbolName, priceInWei, amount);
         }
       

        
    }

    function cancelOrder(string memory symbolName, bool isSellorder,uint  priceInWei,uint offerkey) public{
        uint8 symbolIndex=getSymbolIndexOrThrow(symbolName);

        if(isSellorder){
            require(token[symbolIndex].sellBook[priceInWei].offers[offerkey].who==msg.sender,"Your not the owner");
            uint tokenamount=token[symbolIndex].sellBook[priceInWei].offers[offerkey].amount;
            require(tokenamount+TokenBalanceAddress[msg.sender][symbolIndex]==TokenBalanceAddress[msg.sender][symbolIndex]);
            TokenBalanceAddress[msg.sender][symbolIndex]+=tokenamount;
            token[symbolIndex].sellBook[priceInWei].offers[offerkey].amount=0;
            SellOrderCancelled(symbolIndex, priceInWei, offerkey);


        }else{
             require(token[symbolIndex].buyBook[priceInWei].offers[offerkey].who==msg.sender);
             uint ethertorefund=token[symbolIndex].buyBook[priceInWei].offers[offerkey].amount*priceInWei;
             require(balanceEtherAddress[msg.sender]+ethertorefund>=balanceEtherAddress[msg.sender]);
             balanceEtherAddress[msg.sender]+=ethertorefund;
             token[symbolIndex].buyBook[priceInWei].offers[offerkey].amount=0;
             BuyOrderCancelled(symbolIndex,priceInWei, offerkey);


        }
        
    }

    //////////////////////
    /////ADD OFFER///////
    ////////////////////
    function addBuyOffer(uint8 Index,uint priceinwei,uint amount ,address sender) public{
        token[Index].buyBook[priceinwei].offer_length++;
        token[Index].buyBook[priceinwei].offers[token[Index].buyBook[priceinwei].offer_length]=offer(amount,sender);


        if(token[Index].buyBook[priceinwei].offer_length==1){
            token[Index].buyBook[priceinwei].offer_key=1;

            token[Index].amountBuyPrice++;
            uint curBuyprice=token[Index].curBuyPrice;
            uint lowestBuyPrice=token[Index].lowestBuyprice;
            if(lowestBuyPrice==0||lowestBuyPrice>priceinwei){
                if(curBuyprice==0){
                    //inserting the first buy order
                    token[Index].curBuyPrice=priceinwei;
                    token[Index].buyBook[priceinwei].higherPrice=priceinwei;
                    token[Index].buyBook[priceinwei].lowerPrice=0;
                }
                else{
                    //the offer to buy is the Lowest one,
                    token[Index].buyBook[lowestBuyPrice].lowerPrice=priceinwei;
                    token[Index].buyBook[priceinwei].higherPrice=lowestBuyPrice;
                    token[Index].buyBook[priceinwei].lowerPrice=0;

                }

                token[Index].lowestBuyprice=priceinwei;
            }else if (curBuyprice < priceinwei) {
                //the offer to buy is the highest one, we don't need to find the right spot
                token[Index].buyBook[curBuyprice].higherPrice = priceinwei;
                token[Index].buyBook[priceinwei].higherPrice = priceinwei;
                token[Index].buyBook[priceinwei].lowerPrice = curBuyprice;
                token[Index].curBuyPrice = priceinwei;

            }else {
                //we are somewhere in the middle, we need to find the right spot first...

                uint buyPrice = token[Index].curBuyPrice;
                bool weFoundIt = false;
                while (buyPrice > 0 && !weFoundIt) {
                    if (
                    buyPrice < priceinwei &&
                    token[Index].buyBook[buyPrice].higherPrice > priceinwei
                    ) {
                        //set the new order-book entry higher/lowerPrice first right
                        token[Index].buyBook[priceinwei].lowerPrice = buyPrice;
                        token[Index].buyBook[priceinwei].higherPrice = token[Index].buyBook[buyPrice].higherPrice;

                        //set the higherPrice'd order-book entries lowerPrice to the current Price
                        token[Index].buyBook[token[Index].buyBook[buyPrice].higherPrice].lowerPrice = priceinwei;
                        //set the lowerPrice'd order-book entries higherPrice to the current Price
                        token[Index].buyBook[buyPrice].higherPrice = priceinwei;

                        //set we found it.
                        weFoundIt = true;
                    }
                    buyPrice = token[Index].buyBook[buyPrice].lowerPrice;
                }
            

        }



        }
    }

     function addSellOffer(uint8 Index,uint priceinwei,uint amount ,address sender) public{
        token[Index].sellBook[priceinwei].offer_length++;
        token[Index].sellBook[priceinwei].offers[token[Index].buyBook[priceinwei].offer_length]=offer(amount,sender);

        if(token[Index].sellBook[priceinwei].offer_length==1){
            token[Index].sellBook[priceinwei].offer_key=1;
            uint cursellprice=token[Index].curSellPrice;
            uint highestsellprice=token[Index].highestSellprice;
            if(highestsellprice==0||highestsellprice<priceinwei){
                if(cursellprice==0){
                    token[Index].curSellPrice=priceinwei;
                    token[Index].sellBook[priceinwei].higherPrice=0;
                    token[Index].sellBook[priceinwei].lowerPrice=0;
                }
                else{
                    token[Index].sellBook[priceinwei].lowerPrice=highestsellprice;
                    token[Index].sellBook[priceinwei].higherPrice=0;
                    token[Index].sellBook[highestsellprice].higherPrice=priceinwei;
                }
                token[Index].highestSellprice=priceinwei;

            }else if(cursellprice>priceinwei){
                token[Index].sellBook[cursellprice].lowerPrice=priceinwei;
                token[Index].sellBook[priceinwei].lowerPrice=0;
                token[Index].sellBook[priceinwei].higherPrice=cursellprice;
                token[Index].curSellPrice=priceinwei;



            }else
            {
                    uint sellprice=token[Index].curSellPrice;
                    bool weFoundit=false;
                    while(sellprice>0&&!weFoundit)
                    {
                        if(token[Index].sellBook[sellprice].higherPrice>priceinwei  &&  priceinwei>sellprice)
                        {
                            
                            token[Index].sellBook[priceinwei].higherPrice=token[Index].sellBook[sellprice].higherPrice;
                            token[Index].sellBook[priceinwei].lowerPrice=sellprice;
                            token[Index].sellBook[sellprice].higherPrice=priceinwei;
                            token[Index].sellBook[token[Index].sellBook[sellprice].higherPrice].lowerPrice=priceinwei;
                            weFoundit=true;

                        }
                        sellprice=token[Index].sellBook[sellprice].higherPrice;
                    }




            }


        }         
     }

    
}