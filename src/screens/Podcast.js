import React,{Component} from 'react';
import {View,StyleSheet,FlatList,TouchableOpacity,Linking,ScrollView,SafeAreaView,ActivityIndicator,ImageBackground} from 'react-native';
import {Image} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment';
import {AdMobBanner} from 'expo-ads-admob';
import {Content, Card, CardItem, Thumbnail, Text, Button,Left, Body, } from 'native-base';
import HTML from "react-native-render-html";
class Podcast extends Component{
    constructor(){
        super();
        this.state={
          isLoading:true,
          podcast:[],isPlaying: false,playbackInstance: null,currentIndex: 0,volume: 1.0,isBuffering: true,sounds:'',playingStatus:"nosound"
        }
    }
    async componentDidMount(){
      const response = await fetch('https://wiggletunes.co.za/wp-json/wp/v2/podcast');
      const data = await response.json();
      this.setState({
        podcast:[...data],
        isLoading:false
      })

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false,
          useNativeControls:false
        })
  
        this.playRecording()
      } catch (e) {
        console.log(e)
      }
}

    async playRecording(e) {
      const {isPlaying,volume}=this.state;
      const playbackInstance = new Audio.Sound()
      const source = {
				uri: e
			}
      const status = {
				shouldPlay: isPlaying,
				volume: volume
			}
      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
      await playbackInstance.loadAsync(source, status, false)
      this.setState({
				playbackInstance:playbackInstance
			})
     
      isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
      this.setState({
        isPlaying: !isPlaying
      })
}

onPlaybackStatusUpdate = status => {
  this.setState({
    isBuffering: status.isBuffering,
  })
}
    // async _pauseAndPlayRecording() {
    //   const {isPlaying}=this.state;
    //   if (this.sound != null) {
    //     if (this.state.playingStatus == 'playing') {
    //       console.log('pausing...');
    //       await this.sound.pauseAsync();
    //       console.log('paused!');
    //       this.setState({
    //         playingStatus: 'donepause',
    //         isPlaying:false
    //       });
    //     } else {
    //       console.log('playing...')
    //       await this.sound.playAsync();
        
         
    //       console.log('playing!');
    //       this.setState({
    //         playingStatus: 'playing',
    //         isPlaying:true
    //       });
    //     }
    //   }
    // }

    // _syncPauseAndPlayRecording() {
    //   if (this.sound != null) {
    //     if (this.state.playingStatus == 'playing') {
    //       this.sound.pauseAsync();
    //     } else {
    //       this.sound.playAsync();
    //     }
    //   }
    // }

    // _playAndPause = (e) => {
    //   switch (this.state.playingStatus) {
    //     case 'nosound':
    //       this._playRecording(e);
    //       break;
    //     case 'donepause':
    //     case 'playing':
    //       this._pauseAndPlayRecording();
    //       break;
    //   }
    // }
    render(){
      const {podcast,isPlaying}=this.state;
      const {navigation}=this.props;
      console.log(this.state.sounds)
      if(this.state.isLoading){
        return(
          <View style={styles.containers}>
              <ActivityIndicator size="large" color="#a80404"/>
          </View>
        )
      }
        return(
          <View style={{backgroundColor:'#161616',justifyContent:'center',alignItems:'center'}}>
               <FlatList
                numColumns={2}
                keyExtractor={item=>item.id.toString()}
                data={podcast} 
                renderItem={({item})=>(
                  <TouchableOpacity style={{margin:10}} onPress={()=>{
                    navigation.navigate('Podcast Detail',{
                      Data:[item]
                    })
                    console.log('This works')
                  }}>
                    <View style={styles.box}>
                                  <ImageBackground
                      source={{uri:item.episode_featured_image}}
                      style={styles.imagestyle}
                     />
                     </View>
                      {/* <Text style={{color:'white',fontSize:6,marginLeft:10}}>{item.title.rendered}</Text>  */}
                  </TouchableOpacity>
                )}
               />
              <AdMobBanner
                  style={{width:'100%'}}
                  bannerSize="fullBanner"
                  adUnitID="ca-app-pub-4848737122422413/6221324032" // Test ID, Replace with your-admob-unit-id
                  servePersonalizedAds // true or false
                  onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
    },
    controls: {
      flexDirection: 'row'
    },
    containers:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'black'
    },
    imagestyle:{
      width:170,
      height:200,
      borderRadius:20,
      overflow:'hidden',
      shadowColor: "#ffffff",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
  
      elevation: 24,
      zIndex:999, 
    },
    box:{
      shadowColor: "#ffffff",
      shadowOffset: {
        width: 10,
        height: 10,
      },
      shadowOpacity: 2.51,
      shadowRadius: 1.16,
  
      elevation: 3,
      backgroundColor:'#0000'
    },  
    textColor:{
         color:'white',
    
    },
    albumCover: {
      width: 250,
      height: 250
    },
    trackInfo: {
      padding: 40,
      backgroundColor: '#fff'
    },
  
    trackInfoText: {
      textAlign: 'center',
      flexWrap: 'wrap',
      color: '#550088'
    },
    largeText: {
      fontSize: 22
    },
    Podcast:{
         fontSize:23,
       color:'white',
       marginRight:200
    },
    smallText: {
      fontSize: 16
    },
    control: {
      margin: 20
    },
    controls: {
      position:'absolute',
      left:'40%',
      top:'25%',
      zIndex:100,
      elevation: 20,
      flexDirection: 'row'
    },
    admob:{
      position:'absolute',
      top:'90%',
    }
})


export default Podcast;


