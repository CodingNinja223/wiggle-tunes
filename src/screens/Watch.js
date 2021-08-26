import React,{Component} from 'react';
import {WebView} from 'react-native-webview';
import {View,Text,StyleSheet} from 'react-native';
class Watch extends Component{
    render(){
        return(
            <WebView
            source={{
            uri: 'https://www.youtube.com/channel/UCJBqTfRmBYwAQJ7k4UZud7A'
            }}
            
         /> 
        )
}
}
export default Watch;

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

