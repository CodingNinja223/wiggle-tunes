const express =require('express');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');const cors =require('cors');

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AW7csyPvcIcHCvwhR4uNKtBWIVIBUJ3pqjUqOE-vmf1imU42weUQUsSybNl62q6smL_TTlYW-rw5Pxyb',
  'client_secret': 'EMPvbzsmxAB0I_UluZ93F0HsRrr3RhUjTuPAK4O0_v8lw-ZGW0raHlhGn1uCzkIB2cQkzqKYQ65PcUWU'
});

app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });




app.post('/pay', async (req,res,next)=>{
    console.log('Its working');
    const total=req.body.total;
    console.log(total);
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Redhock Bar Soap",
                  "sku": "001",
                  "price": total,
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": total
          },
          "description": "Washing Bar soap"
      }]
  };
  
  paypal.payment.create(create_payment_json, (error, payment)=> {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
    next();
})

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
  };

// Obtains the transaction details from paypal
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('Success');
    }
});
});

app.get('/cancel', (req, res) => res.send('Cancelled'));


const hostname="185.168.8.102";
const port="3000";
app.listen(port,hostname,()=>{
  console.log(`Server running at http://${hostname}:${port}/`);
});

