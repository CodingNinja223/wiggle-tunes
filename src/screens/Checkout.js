import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {clearItemFromCart,
    addItem,
    removeItem } from '../../redux/cart/cart.actions';
import { createStructuredSelector } from 'reselect';
import { selectCartItems } from '../../redux/cart/cart.selector';
import { AntDesign,Entypo  } from '@expo/vector-icons'; 


const Checkout=({clearItem,addItem,removeItem,cartItems})=>{

    const amount=cartItems.map(item=>{
        return item.productPrice
    })

    const quantity=cartItems.map(item=>{
        return item.quantity
    })


const paymentData = {
    merchant_id : 10000100,
    merchant_key: '46f0cd694581a',
    amount: Number(amount) * Number(quantity),
    item_name: 'Wiggle Tunes Purchase'
};

console.log(paymentData.amount)
        return(
          <View style={styles.container}>
                {cartItems.map(item=>(
                    <View key={item.productId} style={styles.inline}>
                    <Text style={{color:'white',fontSize:15,marginRight:15}}>{item.productTitle}</Text>
                   <View style={{flexDirection:'row',marginLeft:20}}>
                    <AntDesign name="caretleft" style={{marginRight:10}} size={24} color="white" onPress={()=>removeItem(item)} />
                      <Text style={{color:'white'}}>{item.quantity}</Text>
                    <AntDesign name="caretright" style={{marginLeft:10}} size={24} color="white" onPress={()=>addItem(item)}/>
                    <Text style={{color:'white',marginLeft:20,marginTop:5}}>{item.productPrice}</Text>
                    <Entypo name="cross" size={24} style={{marginLeft:25}} onPress={()=>clearItem(item)} color="white" />
                    </View>
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