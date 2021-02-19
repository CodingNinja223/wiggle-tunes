import React from 'react';
import {WebView} from 'react-native-webview';
const SongRequest =()=>{
      return(
        <WebView
        source={{
        uri: 'https://www.wiggletunes.co.za/song-request/'
        }}
        
     />
      )
}
export default SongRequest;