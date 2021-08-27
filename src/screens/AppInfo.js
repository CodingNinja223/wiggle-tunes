import React from 'react'
import { View,Text,StyleSheet,Image } from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'
const AppInfo=()=>{
    return(
      <View style={styles.container}>
          <Text style={{fontWeight:'bold',fontSize:23,color:'white',textAlign:'center',fontFamily:'roboto'}}>Wiggle Tunes</Text> 
          <Text style={{textAlign:'center',color:'white'}}>Version 5.0.1</Text> 
          <Image source={require('../img/icon.png')} style={{height:200,width:200}}/> 
          <View>
              <MaterialIcons name="copyright" size={24} color="black" />
              <Text style={{textAlign:'center',color:'white'}}>2018 - 2021 Wiggle Tunes.</Text>  
              <Text style={{textAlign:'center',color:'white'}}>Powered by Wiggle Digital Ltd</Text>
          </View>  
      </View>
    )
}


const styles=StyleSheet.create({
    container:{
      backgroundColor:'black',
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    }
})

export default AppInfo;