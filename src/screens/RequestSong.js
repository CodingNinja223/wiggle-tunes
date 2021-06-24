import React from 'react'
import {WebView} from 'react-native-webview';
const RequestSong=()=>{
    return(
<WebView
        source={{
        uri: 'https://www.wiggletunes.co.za/request-song/'
        }}
       
     />
    )
}
export default RequestSong;