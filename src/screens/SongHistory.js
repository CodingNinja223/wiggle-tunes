import React from 'react';
import {WebView} from 'react-native-webview';
const Histrory =()=>{


  const java=`
    const don=document.querySelector("li").style.fontSize="10px";
  `;
    return(
      <WebView
      javaScriptEnabled={true}
      injectedJavaScript={java}
      source={{
      uri: 'https://www.wiggletunes.co.za/song-history-v4.html'
      }}
      
   />
    )
}
export default Histrory;


/**
 * 
 // .radioco_history10 ul li {
    color: #fff !important;
    line-height: 2.1;
    /* font-size: 35pt !important; */
   // border-bottom: 1px solid #d6d6d6;
   // padding: 5px;
   // margin: 2px;
   // list-style: none !important;
//}
 //* 
 //* 
 //*/