import React,{Component} from 'react';
import {WebView} from 'react-native-webview';
class Feedback extends Component{
    constructor(){
        super();
        this.state={
            name:'', email:'',message:''
        }
    }
    render(){
        return(
            <WebView
             source={{
             uri: 'https://www.wiggletunes.co.za/feedback-2/'
            }}
  
         />
        )
    }
}



export default Feedback