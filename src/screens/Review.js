import React,{Component} from 'react';
import {WebView} from 'react-native-webview';
class Reviews extends Component{
    render(){
        return(
          <WebView
            source={{
            uri: 'https://play.google.com/store/apps/details?id=com.wiggletunes.app'
            }}
           
         />
        )
    }
}
export default Reviews;