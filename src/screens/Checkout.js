import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,Linking} from 'react-native';
import {connect} from 'react-redux';
import {clearItemFromCart,
    addItem,
    removeItem } from '../../redux/cart/cart.actions';
import { createStructuredSelector } from 'reselect';
import { selectCartItems,selectCartTotal } from '../../redux/cart/cart.selector';
import { AntDesign,Entypo  } from '@expo/vector-icons'; 
import { Thumbnail } from 'native-base';
import axios from 'axios'

class Checkout extends Component{
constructor(){
  super();
  this.state={
    info:[],
    name:'Samuel'
  }
}

    purchase=()=>{
      axios.post('http://185.168.8.102:3000/pay', {
        total:Math.round(this.props.total)
      })
      .then((response)=> {
        console.log(response);
      })
      .catch((error)=> {
        console.log(error);
      });
    console.log('This is logistics');
 }

        render(){
        console.log(this.state.info);
        const {clearItem,addItem,removeItem,cartItems,total}=this.props;
        const paymentData = {
          merchant_id : 10000100,
          merchant_key: '46f0cd694581a',
          amount: 60.00,
          item_name: 'React Native Purchase'
      };
        return(
          <ScrollView style={styles.container}>
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
                      <Text style={styles.payNow} onPress={async ()=> await Linking.openURL('https://www.wiggletunes.co.za/shop/')}>Pay Now</Text>
                  </TouchableOpacity>
                  </View>     
                </View>
          </View>
          </ScrollView>
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



// const {clearItem,addItem,removeItem,cartItems,total}=this.props;
        // console.log('Purchase is made');
        //   axios.post('http://185.168.8.102:3000/create_payment_intent',{
        //     total:total
        //   })
        //   .then((res)=>{
        //     console.log(res)
        //   })
        //   .catch((err)=>{
        //     console.log(err)
        //   })

        // const OPTIONS = {
      //   requestPayerName: true,
      //   requestPayerPhone: true,
      //   requestPayerEmail: true,
      //   requestShipping: true
      // };
      // const METHOD_DATA = [{
      //   supportedMethods: ['android-pay'],
      //   data: {
      //     supportedNetworks: ['visa', 'mastercard', 'amex'],
      //     currencyCode: 'USD',
      //     environment: 'TEST', // defaults to production
      //     paymentMethodTokenizationParameters: {
      //       tokenizationType: 'NETWORK_TOKEN',
      //       parameters: {
      //         gateway: 'stripe',
      //         publicKey: 'pk_test_51IJJxMK275WVR6ookgavfF6Oym2fl09sZtRnn23BclXLHQEjD6rqHtwWLxm1SE90Zwvzow0uQDctVklN5SRBjIrq00h5V8icfy'
      //       }
      //     }
      //   }
      // }];

      // const DETAILS = {
      //   id: 'basic-example',
      //   displayItems: [
      //     {
      //       label: 'Movie Ticket',
      //       amount: { currency: 'USD', value: `${this.props.total}` }
      //     }
      //   ],
      //   total: {
      //     label: 'Wiggle Tunes',
      //     amount: { currency: 'USD', value: `${this.props.total}` }
      //   }
      // };

      // const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS,OPTIONS);

      // paymentRequest.show()
      // .then((res)=>{
      //   console.log(res)
      // })
      // .catch(err=>{
      //   console.log(err)
      // })