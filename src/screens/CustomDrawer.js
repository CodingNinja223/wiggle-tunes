import React from 'react'
import {View,Image,Linking} from 'react-native';
import {DrawerContentScrollView,DrawerItemList,DrawerItem} from '@react-navigation/drawer';
import { FontAwesome } from '@expo/vector-icons'; 

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem label={()=>(<Image source={require('../img/icon.png')}/>)} style={{marginVertical:50}} />
        <DrawerItemList {...props} />
        <DrawerItem label={()=>(
        <View style={{flexDirection:'row'}}>
         <FontAwesome name="whatsapp" size={24} color="#25D366" style={{margin:10}} onPress={()=>Linking.openURL('https://api.whatsapp.com/send?phone=2766%20057%206802&text=')}/>
          <FontAwesome name="facebook" size={24} color="#4267B2" style={{margin:10}} onPress={()=>Linking.openURL('https://www.facebook.com/wiggletunes/')} />
          <FontAwesome name="twitter" size={24} color="#1DA1F2" style={{margin:10}} onPress={()=>Linking.openURL('https://twitter.com/WiggleTunesSA')} />
          <FontAwesome name="youtube-play" size={24} color="#FF0000" style={{margin:10}} onPress={()=>Linking.openURL('https://www.youtube.com/channel/UCJBqTfRmBYwAQJ7k4UZud7A?view_as=subscriber')} />
          <FontAwesome name="instagram" size={24} color="#405DE6" style={{margin:10}} onPress={()=>Linking.openURL('https://www.instagram.com/wiggletunes_sa/?hl=en')}/>
          <Image  source={require('../img/tok.jpg')} style={{width:20,height:20,marginTop:12,marginLeft:10}} onPress={()=>Linking.openURL('https://www.tiktok.com/@wiggletunes/')}/>
        </View>)} style={{marginVertical:20}} />

      </DrawerContentScrollView>
    );
  }
  export default CustomDrawerContent;