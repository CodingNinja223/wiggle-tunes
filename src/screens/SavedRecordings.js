import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native'


class SavedRecording extends Component{
    constructor(){
        super()
    }




    render(){
        return(
          <View style={styles.container}>
              <Text>Your Recordings</Text>
          </View>
        )
    }
}


export default SavedRecording;

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})