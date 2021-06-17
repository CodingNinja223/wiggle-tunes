const express =require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('pk_test_51IJJxMK275WVR6ookgavfF6Oym2fl09sZtRnn23BclXLHQEjD6rqHtwWLxm1SE90Zwvzow0uQDctVklN5SRBjIrq00h5V8icfy');
const cors =require('cors');

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


app.use(cors());
console.log("Its working");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/create_payment_intent', (req,res,next)=>{
  const total=req.body.total;
  console.log(total);
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // const intent = await stripe.paymentIntents.create({
  //   amount: total,
  //   currency: 'zar',
  //   payment_method_types: ['card_present'],
  //   capture_method: 'manual',
  // });
  // res.json({client_secret:intent.client_secret})
  // console.log('CORS-enabled web server listening on port 80')
  next();
})





app.listen(3000);