import React from 'react';
import {WebView} from 'react-native-webview';
const Histrory =()=>{
    return(
      <WebView
      source={{
      uri: 'https://www.wiggletunes.co.za/song-history-v4.html'
      }}
      
   />
    )
}
export default Histrory;