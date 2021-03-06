const BumoSDK = require('bumo-sdk');
const encryption = require('bumo-encryption');
const BigNumber = require('bignumber.js');

const options = {
  host: '127.0.0.1:36002',
};
const sdk = new BumoSDK(options);
const settleContract = async function(cad){
  const genesisaddress = 'buQf5VAcYgWhJTp9Fywpu7W9KWfnUTK55MHt';
  const genesispk = 'privbyrGtc3YaTLf4iWPU68Dwx83j8jjLvsoqAS3zbjVX5BcDvP7uYhE';
//获取Nonce
  const nonceInfo = await sdk.account.getNonce(genesisaddress)
  if(nonceInfo.errorCode != 0){
    console.log(nonceInfo);
    return;
  }
  let nonce = nonceInfo.result.nonce;
  nonce = new BigNumber(nonce).plus(1).toString(10);
//构建操作
   const initInput = {
        method: 'settle',
   }
   const operationInfo = await sdk.operation.contractInvokeByBUOperation({
       contractAddress: cad,
       input: JSON.stringify(initInput),
   });
   if(operationInfo.errorCode != 0){
      console.log(operationInfo);
      return;
    }
    const operation = operationInfo.result.operation;
 //序列化交易
   const buildInfo = await sdk.transaction.buildBlob({
       sourceAddress : genesisaddress,
       gasPrice : '1000',
       feeLimit : '2001030000',
       nonce : nonce,
       operations : [ operation ],
   });
   if(buildInfo.errorCode !=0){
        console.log(buildInfo);
        return;
   }
   const blob = buildInfo.result.transactionBlob;
//用私钥进行签名
    const signatureInfo = sdk.transaction.sign({
    privateKeys : [ genesispk ],
    blob : blob,
  });
   if (signatureInfo.errorCode != 0){
    console.log(signatureInfo);
    return;
   }
   let signature = signatureInfo.result.signatures; 
//广播
   const submitInfo = await sdk.transaction.submit({
    blob,
    signature,
   });
   return submitInfo;
};
// CreateProject().then(result =>{
//   console.log(result);
//   return result;
// })
// .catch(err =>{
//   console.log(err);
// });

module.exports.settleContract = settleContract;