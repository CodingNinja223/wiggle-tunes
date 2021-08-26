import React,{Component} from 'react';
import {View,StyleSheet,FlatList,TouchableOpacity,Linking,ScrollView,SafeAreaView,ActivityIndicator,ImageBackground} from 'react-native';
import {connect} from 'react-redux'
import { Audio } from 'expo-av';
import {AdMobBanner} from 'expo-ads-admob';
import { createStructuredSelector  } from 'reselect';
import { selectPodcastData } from '../../redux/sound/sound.selectors';

class Podcast extends Component{
    constructor(){
        super();
        this.state={
          isLoading:true,
          podcast:[],
          isPlaying: false,
          playbackInstance: null,
          currentIndex: 0,
          volume: 1.0,
          isBuffering: true,
          sounds:'',
          playingStatus:"nosound"
        }
    }
    async componentDidMount(){
      this.setState({
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
    
    render(){
      const {navigation,itemC}=this.props;
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
                keyExtractor={item=>item.id.toString()}
                data={itemC} 
                renderItem={({item})=>(
                  <TouchableOpacity style={{margin:10}} onPress={()=>{
                    navigation.navigate('Podcast Detail',{
                      Data:[item],
                      image:item.episode_featured_image,
                      title:item.title.rendered,
                      type:item.type,
                      music:item.meta.audio_file
                    })
                    console.log("this is the image",item.meta.audio_file)
                    console.log('This works')
                  }}>
                    <View>
                                  <ImageBackground
                      source={{uri:item.episode_featured_image}}
                      style={styles.imagestyle}
                     >
                       </ImageBackground>
                     </View>
                  </TouchableOpacity>
                )}
               />
              <AdMobBanner
                  style={{width:'100%',height:200}}
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
    title:{
     color:'white',
     position:'absolute',
     top:'50%',
     left:'5%',
     textAlign:'center',
     elevation: 24,
      zIndex:999,
     fontSize:10
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
      width:400,
      height:250,
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
      resizeMode:'contain'
    },
    // box:{
    //   shadowColor: "#ffffff",
    //   shadowOffset: {
    //     width: 10,
    //     height: 10,
    //   },
    //   shadowOpacity: 2.51,
    //   shadowRadius: 1.16,
    //   zIndex:999, 
    //   elevation: 3,
    //   backgroundColor:'#ffffff'
    // },  
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

const mapStateToProps=createStructuredSelector({
  itemC:selectPodcastData
 })
export default connect(mapStateToProps)(Podcast);


