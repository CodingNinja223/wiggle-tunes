import React,{Component} from 'react';
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,Linking} from 'react-native';
import {AdMobBanner} from 'expo-ads-admob';
import {connect} from 'react-redux'
import {addItem} from '../../redux/cart/cart.actions'



class ProductDetail extends Component{
  render(){
  const {productTitle,productImage,productPrice, productId}=this.props.route.params;
 console.log(this.props.route.params);
  return(
    <ScrollView style={{backgroundColor:'#161616'}}>
        <Image source={{uri:productImage}} style={styles.image}/>
        <View style={styles.item}>
            <Text style={styles.center}>{productTitle}</Text>
           <Text style={styles.price}>R{Number(productPrice)}</Text>
        </View>
        <View style={{marginVertical:5}}>
             <TouchableOpacity style={styles.button} onPress={()=> {
               this.props.addItem(this.props.route.params)
               console.log(`This is the products ${this.props.route.params}`)
               }}>
                  <Text style={{color:'black',textAlign:'center'}}>Add To Cart</Text>
             </TouchableOpacity>
        </View>
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-4848737122422413/6221324032" // Test ID, Replace with your-admob-unit-id
          servePersonalizedAds // true or false
          onDidFailToReceiveAdWithError={this.bannerError} /> 
    </ScrollView>
  )
}
}



const styles=StyleSheet.create({
  image:{
    resizeMode:'contain',
    height:500,
  },
  center:{
    textAlign:'left',
    margin:15,
    color:'white',
    fontSize:28
  },
  items:{
    margin:10
  },
  price:{
    textAlign:'left',
    margin:15,
    color:'white',
    fontSize:25
  },
  button:{
    backgroundColor:'white',
    borderRadius:4,
    width:'50%',
    padding:15,
    marginLeft:180
  }
})

const mapDispatchToProps=dispatch=>({
  addItem: item => dispatch(addItem(item))
})

export default connect(null,mapDispatchToProps)(ProductDetail);