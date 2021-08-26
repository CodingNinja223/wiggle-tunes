import React from 'react';
import { View,Text,StyleSheet } from 'react-native';

const Interviews =()=>{
    return(
      <View style={styles.container}>
           <Text style={{color:'white'}}>This is the  Interviews</Text>
      </View>
    )
}




const styles=StyleSheet.create({
    container:{
        backgroundColor:'black',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default Interviews