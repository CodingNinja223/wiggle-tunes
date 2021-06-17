import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {clearItemFromCart,
    addItem,
    removeItem } from '../../redux/cart/cart.actions';
import { createStructuredSelector } from 'reselect';
import { selectCartItems,selectCartTotal } from '../../redux/cart/cart.selector';
import { AntDesign,Entypo  } from '@expo/vector-icons'; 
import { Thumbnail } from 'native-base';
// import stripe from 'react-native-stripe-payments';
import axios from 'axios';
import { GooglePay } from 'react-native-google-pay';


class Checkout extends Component{


    purchase=()=>{
    const {total}=this.props;

    // axios.post('http://localhost:3000/create_payment_intent', {
    //     total:total
    //   })
    //   .then((response)=> {
    //     console.log(response);
    //   })
    //   .catch((error)=> {
    //     console.log(error);
    //     console.log('this not working');
    //   });
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const requestData = {
    cardPaymentMethod: {
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        // stripe (see Example):
        gateway: 'stripe',
        gatewayMerchantId: '',
        stripe: {
          publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
          version: '2018-11-08',
        },
        // other:
        gateway: 'example',
        gatewayMerchantId: 'exampleGatewayMerchantId',
      },
      allowedCardNetworks,
      allowedCardAuthMethods,
    },
    transaction: {
      totalPrice: this.props.total,
      totalPriceStatus: 'FINAL',
      currencyCode: 'USD',
    },
    merchantName: 'Example Merchant',
  };

  GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

  GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
  .then((ready) => {
    if (ready) {
      // Request payment token
      GooglePay.requestPayment(requestData)
        .then((data) => {
          // Send a token to your payment gateway
          console.log(data)
        })
        .catch((error) => console.log(error.code, error.message));
    }
  })

}

        render(){
          const {clearItem,addItem,removeItem,cartItems,total}=this.props;
          const paymentData = {
            merchant_id : 10000100,
            merchant_key: '46f0cd694581a',
            amount: 60.00,
            item_name: 'React Native Purchase'
        };
        return(
          <View style={styles.container}>
                {cartItems.map(item=>(
                <View style={{marginVertical:15}}>
                    <View key={item.productId} style={styles.inline}>
                    <Thumbnail square small source={{uri:`${item.productImage}`}}  style={{marginRight:5}}/>
                    <Text style={{color:'white',fontSize:15,marginRight:5}}>{item.productTitle}</Text>
                   <View style={{flexDirection:'row',marginLeft:20}}>
                    <AntDesign name="caretleft" style={{marginRight:10}} size={24} color="white" onPress={()=>removeItem(item)} />
                      <Text style={{color:'white'}}>{item.quantity}</Text>
                    <AntDesign name="caretright" style={{marginLeft:10}} size={24} color="white" onPress={()=>addItem(item)}/>
                    <Text style={{color:'white',marginLeft:20,marginTop:5}}>R{Math.round(item.productPrice * item.quantity)}</Text>
                    <Entypo name="cross" size={24} style={{marginLeft:25}} onPress={()=>clearItem(item)} color="white" />
                    </View>
                    </View>
                </View>
                ))}
                <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
                    <View style={{flexDirection:'column'}}>
                <Text style={{color:'white',textAlign:'center'}}>Total:R{Math.round(total)}</Text>
                <Text>{'  '}</Text>
                  <TouchableOpacity onPress={()=>this.purchase()}>
                      <Text style={styles.payNow}>Pay Now</Text>
                  </TouchableOpacity>
                  </View>
                </View>
          </View>
    )
}
}


const mapDispatchToProps=dispatch=>({
    clearItem: item => dispatch(clearItemFromCart(item)),
    addItem:item=>dispatch(addItem(item)),
    removeItem:item =>dispatch(removeItem(item))
})

const mapStateToProps=createStructuredSelector({
    cartItems:selectCartItems,
    total:selectCartTotal
})

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000000'
    },
    inline:{
        flexDirection:'row',
        marginLeft:10,
        justifyContent:'center',
        alignItems:'center'
    },
    payNow:{
        color:'red'
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Checkout);



