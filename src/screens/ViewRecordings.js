import React,{Component} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {storage} from '../util/firebase';
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av';
class ViewRecordings extends Component{
    constructor(){
        super();
        this.state={
            isPlaying: false,
            playbackInstance: null,
            currentIndex: 0,
            volume: 1,
            isBuffering: true,
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
            var storages = storage;
    
            var pathReference = storage.ref('voices/file:/data/user/0/com.wiggletunes.app/cache/sound.mp4');
            
            const downloadUrl = await pathReference.getDownloadURL();
    
            console.log(downloadUrl);
            this.setState({
                sound:downloadUrl
            })
    
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    allowsRecordingIOS: false,
                    staysActiveInBackground: true,
                    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                    shouldDuckAndroid: false,
                    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                    playThroughEarpieceAndroid: false,
                })
    
                this.loadAudio()
            } catch (e) {
                console.log(e)
            }
    }

    async loadAudio() {
		const { currentIndex, isPlaying, volume,rate } = this.state

		try {
			const playbackInstance = new Audio.Sound()
			const source = {
				uri: this.state.downloadUrl
			}

			const status = {
				shouldPlay: isPlaying,
				volume: volume
			}

			playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
			await playbackInstance.loadAsync(source, status, false)
			this.setState({
				playbackInstance
			})
		} catch (e) {
			console.log(e)
        }
    }


    onPlaybackStatusUpdate = status => {
        this.setState({
            isBuffering: status.isBuffering,
        })
    }
    
    handlePlayPause = async () => {
        const { isPlaying, playbackInstance } = this.state
        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
        this.setState({
            isPlaying: !isPlaying
        })
    }

    render(){
       
        return(
         <View style={styles.container}>
             <Text style={styles.textColor}>Recordings</Text>
             <View style={styles.controls}>
					<TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
						{this.state.isPlaying ? (
							<Ionicons name='ios-pause' size={125} color='white' />
						) : (
							<Ionicons name='ios-play-circle' size={125} color='white' />
						)}
					</TouchableOpacity>
				</View> 
         </View>
        )
    }
}



export default ViewRecordings;

const styles=StyleSheet.create({
    container:{
        backgroundColor:'#000',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    textColor:{
        color:'white'
    }
})