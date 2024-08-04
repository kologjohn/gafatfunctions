const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });
const admin=require('firebase-admin');
admin.initializeApp();
exports.paystack=functions.https.onCall(async(datam,context)=>{
  try{
  if(!context.auth)
  {
    throw new functions.https.HttpsError('unauthenticated','Not authenticated')
  }
  const tid=datam.tid;
   const email=context.auth.token.email;
   const amount=datam.amount;
   const authToken="sk_live_a7df3bdc07941c626420273da1c6820167057ddf";
   const postdata={
     "amount": amount*100,
     "email": email,
     "reference": tid,
     "currency": "NGN",
     "paymentChannel": [
       "mobile_money",
       "card",
       "bank"
     ]
   };
   const config= {
     headers: 
     { 
       'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json'  // Adjust content type based on your API requirements
     } 
   };
   const sendapi=await axios.post('https://api.paystack.co/transaction/initialize',postdata,config) 
   console.log(sendapi.data);
   return sendapi.data;

  }catch(e){
console.log(e)
return e;
  }
  
})
exports.statuscheck=functions.https.onRequest((req,res)=>{
 // var url="https://api-txnstatus.hubtel.com/transactionshttps/2019542/status?clientReference=3jL2KlUy3vt216789"
  const url = "https://api.paystack.co/charge";  
  const originalString = "Hello, World!";
  const clientId = "gZ17kpj";
  const clientSecret = "89b8a64e3e51459f8812b5446e45d576";
  const basic_auth_key = 'Basic ' + btoa(clientId +':' +clientSecret);
  const headers={
    "Authorization":basic_auth_key
  }
  const dataobject={

    "amount": 1000,
  
    "email": "customer@email.com",
  
    "currency": "GHS",
  
    "mobile_money": {
  
      "phone": "0552111770",
  
      "provider": "MTN"
  
    }
  
  };
 
// Define the API endpoint
// Make a GET request with Authorization header
axios.get(url, {
  headers: {
    'Authorization': basic_auth_key
  }
})
  .then(response => {
    console.log('Response:', response.data);
    res.send(response.data)
  })
  .catch(error => {
    console.error('Error:', error);
  });

 // axios.get(url,{""},{})

})
exports.readdata = functions.https.onCall(async (request, response) => {
  try {
    // Get a reference to the Firestore collection
    const collectionRef = admin.firestore().collection('sendmoney');
    const querySnapshot = await collectionRef.get();
    // Query the collection to get documents
    // Process each document
    const data = [];
    querySnapshot.forEach((doc) => {
      // Get the data of each document
      const documentData = doc.data();
      //name=documentData.tid;
      data.push(documentData);
    });

    // Send the data in the response
    return data;
  } catch (error) {
    console.error('Error reading Firestore data:', error);
    return('Internal Server Error');
  }
  
});
exports.testcall = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
  const data = req.body;
  const status = data.ResponseCode;
  const responseMsg = data.Message;
  const transid = data.Data.TransactionId;
  const clientid = data.Data.ClientReference;
  const AmountCharged = data.Data.AmountCharged;
  const amount = data.Data.AmountAfterCharges;
  const msgs = data.Data.Description;
      // Your function logic here
  const api_key="SXlMVlJCcmlTV1dwVGRyZkVneUs";
  const PhoneNumber="0553354349";
  const senderId="GAFAT";
  const email="aaa@gmail.com";
  const name=status;
  var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var codeupdate={"code":req.body};
  var sendmoneyupdate={"status":responseMsg};
  admin.firestore().collection("userstest").doc(clientid).set(codeupdate);
  admin.firestore().collection("sendmoney").doc(clientid).update(sendmoneyupdate);
  //var records= admin.firestore().collection("sendmoney").doc(clientid).get();
  if(responseMsg=="success")
  {
    var message="Hello your transaction ID "+clientid+". \n with an amount GHC"+amount+"has been processed successfully"+ip;
  }
  else
  {
    var message="Hello your transaction ID "+clientid+". \n with an amount GHC"+amount+"count not be completed";

  }
  return axios.get('https://sms.kologsoft.com/sms/api?action=send-sms&api_key='+api_key+'&to='+PhoneNumber+'&from='+senderId+'&sms='+message)
  .then(response => {
    console.log(response.data);
    return res.status(200).json({
      message: response.data
    })
  })
  .catch(err => {
    return res.status(500).json({
      error: err
    })
  })
      //res.status(200).send('Success'+name);
  });
});
exports.moneycallback=functions.https.onCall((data,context)=>{
  const email=context.auth.token.email;
  const rescode=data.ResponseCode;
  console.log(rescode);
      const sendapi= axios.post('https://kologsoft.net/rainin/sms',postdata)
        .then(response => {
          console.log(response.data);
          return response.data;
        })
        .catch(err => {
          return err
          
        })

});

exports.sendmoneyapi=functions.https.onCall((data,context)=>{
  
  if(!context.auth)
  {
    throw new functions.https.HttpsError('unauthenticated','Not authenticated')
  }
  const email=context.auth.token.email;
  const contact=data.contact;
  const key=data.key;
  const tid=data.tid;
  const amount=data.amount;
  //const updatecollection={"status":"waiting"};
  //const update= admin.firestore().collection('sendmoney').doc(key).update(updatecollection);
      var resp="";
      const postdata={
        "contact": contact,
        "amount": amount,
        "des": "Gafat Payment",
        "tid": tid
      };
      const sendapi= axios.post('https://kologsoft.net/rainin/gafatpush',postdata)
        .then(response => {
          console.log(response.data);
          return response.data;
        })
        .catch(err => {
          return err
          
        })
        return sendapi;

})
exports.payment = functions.https.onRequest((req, res) => {
  const api_key="SXlMVlJCcmlTV1dwVGRyZkVneUs";
  const contact=req.body.contact;
  const amount=req.body.amount;
  const authToken="srApjfwsWed0kdpcj6T9";

  var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var postdata={
    "contact": contact,
    "amount": amount,
    "des": "des",
    "tid": authToken
  }
  var codeupdate={
    "amount":200
  }
  admin.firestore().collection("sendmoney").doc(authToken).update(codeupdate);
  cors(req, res, () => {
 
 // admin.firestore().collection("users").doc(email).update(codeupdate);
    //res.status(200).send('Success');
   
    return axios.post('https://kologsoft.net/rainin/sms',postdata)
      .then(response => {
        console.log(response.data);
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(500).json({
          error: err
        })
      })

   })
});

exports.checkIP2 = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
      // Your function logic here
  const api_key="SXlMVlJCcmlTV1dwVGRyZkVneUs";
  const PhoneNumber=req.body.phone;
  const senderId=req.body.senderid;
  const email=req.body.email;
  const name=req.body.name;
  var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var codeupdate={ "code":code}
  admin.firestore().collection("users").doc(email).update(codeupdate);

  let message="Hello "+name+" your OTP is "+code+". \n Please do not share this code with anyone";
  return axios.get('https://sms.kologsoft.com/sms/api?action=send-sms&api_key='+api_key+'&to='+PhoneNumber+'&from='+senderId+'&sms='+message)
  .then(response => {
    console.log(response.data);
    return res.status(200).json({
      message: response.data
    })
  })
  .catch(err => {
    return res.status(500).json({
      error: err
    })
  })
      //res.status(200).send('Success'+name);
  });
});

exports.otpverify=functions.https.onRequest(async (req,res)=>{
  const otp=req.body.code;
  const email=req.body.email;
  var db=await admin.firestore.collection("users").doc(email).get;
  console.log(db);
  res.send("Hello");
})
exports.yourFunction = functions.https.onRequest(async (req, res) => {
  // Get the ID token from the request
  const idToken = req.headers.authorization;

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Access the user's UID from the decoded token
    const uid = decodedToken.uid;

    // Your logic here...
    //admin.firestore().collection("users").doc(email).update(codeupdate);

    // Respond to the request
    res.status(200).send('Success');
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).send('Unauthorized');
  }
});

exports.testcall = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
  const data = req.body;
  const status = data.ResponseCode;
  const responseMsg = data.Message;
  const transid = data.Data.TransactionId;
  const clientid = data.Data.ClientReference;
  const AmountCharged = data.Data.AmountCharged;
  const amount = data.Data.AmountAfterCharges;
  const msgs = data.Data.Description;
      // Your function logic here
  const api_key="SXlMVlJCcmlTV1dwVGRyZkVneUs";
  const PhoneNumber="0553354349";
  const senderId="GAFAT";
  const email="aaa@gmail.com";
  const name=status;
  var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var codeupdate={"code":req.body};
  var sendmoneyupdate={"status":responseMsg};
  admin.firestore().collection("userstest").doc(clientid).set(codeupdate);
  admin.firestore().collection("sendmoney").doc(clientid).update(sendmoneyupdate);
  //var records= admin.firestore().collection("sendmoney").doc(clientid).get();
  if(responseMsg=="success")
  {
    var message="Hello your transaction ID "+clientid+". \n with an amount GHC"+amount+"has been processed successfully"+ip;
  }
  else
  {
    var message="Hello your transaction ID "+clientid+". \n with an amount GHC"+amount+"count not be completed";

  }
  return axios.get('https://sms.kologsoft.com/sms/api?action=send-sms&api_key='+api_key+'&to='+PhoneNumber+'&from='+senderId+'&sms='+message)
  .then(response => {
    console.log(response.data);
    return res.status(200).json({
      message: response.data
    })
  })
  .catch(err => {
    return res.status(500).json({
      error: err
    })
  })
      //res.status(200).send('Success'+name);
  });
});

exports.paystackcall = functions.https.onRequest((req, res) => {
  const responsedata = req.body;
  const status = responsedata.event;
  const reference = responsedata.data.reference;
  const amount = responsedata.data.amount;
  const channel = responsedata.data.channel;
 // res.send(reference);
  var codeupdate={"code":req.body};
  var sendmoneyupdate={"status":"success"};
  admin.firestore().collection("userstest").doc(reference).set(codeupdate);
  admin.firestore().collection("sendmoney").doc(reference).update(sendmoneyupdate);
  //var records= admin.firestore().collection("sendmoney").doc(clientid).get();
   res.status(200).send('Success'+reference);
});
exports.bankname=functions.https.onCall(async(data,contex)=>{
 

  try {
    // Example GET request using Axios
    const code=data.code;
    const accnumber=data.accnumber;
    const authToken="sk_live_a7df3bdc07941c626420273da1c6820167057ddf";

    const url="https://api.paystack.co/bank/resolve?account_number="+accnumber+"&bank_code="+code;
    const config= {
      headers: 
      { 
        'Authorization': `Bearer ${authToken}`,
         'Content-Type': 'application/json' 
      } 
    };
    const response = await axios.get(url,config);
    console.log(response.data);
    const status=response.data.status;
   
  
    return response.data;

    // Your function logic here

  } catch (error) {
    console.error('Error:', error.message);
    return (error);
  }

})

exports.banklist=functions.https.onCall(async(data,context)=>{
  if(!context.auth)
  {
    throw new functions.https.HttpsError('unauthenticated','Not authenticated')
  }
  try {
  
    const authToken="sk_live_a7df3bdc07941c626420273da1c6820167057ddf";
    const url="https://api.paystack.co/bank";
    const config= {
      headers: 
      { 
        'Authorization': `Bearer ${authToken}`,
         'Content-Type': 'application/json' 
      } 
    };
    const response = await axios.get(url,config);
    console.log(response.data);
     return response.data.data;
    // Your function logic here
  }catch (error) {
    console.log('ErrorOne:', error.message);
    return (error);
  }

});

exports.momoname=functions.https.onCall(async(data,context)=>{
//  if(context.auth)
//  {
//    throw new functions.https.HttpsError('unauthenticated','Not authenticated')
//  }
//return cors(req, res, async() => {
  try {
    const url="https://kologsoft.net/rainin/momoverify";
    const network=data.code;
    const accnumber=data.accnumber;
    const response = await axios.post(url, {"phone": accnumber,"network": network});
    console.log(response);
     return response.data;
  }catch (error) {
    return (error);
  }

})

exports.currency=functions.https.onCall(async(data,context)=>{
  //  if(!context.auth)
  //  {
  //    throw new functions.https.HttpsError('unauthenticated','Not authenticated')
  //  }
  //return cors(req, res, async() => {
    try {
      const key="ed5b458ce86247ada2434ec038a5ed0d";
      const baserate=data.baserate;
      const symbols=data.symbol;
      const url="https://openexchangerates.org/api/latest.json?app_id="+key+"&base="+baserate+"&symbols="+symbols;
       // const network=data.code;
       // const accnumber=data.accnumber;
       const response = await axios.get(url,{});
       console.log(response);
       return response.data;
    }catch (error) {
      return (error);
    }
  
  })
