import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {clearItemFromCart,
    addItem,
    removeItem } from '../../redux/cart/cart.actions';
import { createStructuredSelector } from 'reselect';
import { selectCartItems } from '../../redux/cart/cart.selector';
import { AntDesign,Entypo  } from '@expo/vector-icons'; 
import { Thumbnail } from 'native-base';

const Checkout=({clearItem,addItem,removeItem,cartItems})=>{

    const amount=cartItems.map(item=>{
        return item.productPrice
    })

    const quantity=cartItems.map(item=>{
        return item.quantity
    })


const paymentData = {
    amount: Math.round(amount * quantity),
};




console.log(paymentData.amount)
        return(
          <View style={styles.container}>
                {cartItems.map(item=>(
                    <View>
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
                    {/* <PaystackWebView
                        buttonText='Pay Now'
                        paystackKey='pk_test_dd01eb1e9b6195a000ffd1a6310f3a9e9483d7c8'
                        amount={120000}
                        billingEmail='ayoshokz@gmail.com'
                        billingMobile='08101274387'
                        billingName='Oluwatobi Shokunbi'
                        ActivityIndicatorColor='red'
                        onSuccess={(tranRef)=>{console.log(tranRef)}}
                        onCancel={()=>{console.log('something went wrong')}}
                     /> */}
                </View>
                ))}
          </View>
    )
}


const mapDispatchToProps=dispatch=>({
    clearItem: item => dispatch(clearItemFromCart(item)),
    addItem:item=>dispatch(addItem(item)),
    removeItem:item =>dispatch(removeItem(item))
})

const mapStateToProps=createStructuredSelector({
    cartItems:selectCartItems
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
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Checkout);