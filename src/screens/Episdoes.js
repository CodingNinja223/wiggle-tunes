import React from 'react'
import { View,Text,StyleSheet } from 'react-native';

const Episodes=()=>{
    return(
      <View style={styles.container}>
          <Text>This is the Episodes</Text>
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

export default Episodes;