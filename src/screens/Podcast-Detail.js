import React,{Component} from "react";
import {Text,Image,View,ScrollView,StyleSheet,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av';
import {toggleCartHidden} from '../../redux/sound/sound';
import { createStructuredSelector } from 'reselect';
import {selectCartHidden} from '../../redux/sound/sound.selectors';

class PodDetail extends Component{
    constructor(){
        super()
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
		const {hidden}=this.props;
		const { currentIndex, isPlaying, volume,rate } = this.state
        const { Data,image,title,type,music} = this.props.route.params;
		console.log(music);
		  const song=Data.map(item=>{
			  return item.meta.audio_file
		  })
		try {
			const playbackInstance = new Audio.Sound()
			const source = {
				uri:song[0]
			}
			
			const status = {
				shouldPlay:hidden,
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
		const {hidden,toggleCartHidden}=this.props;
		toggleCartHidden() ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
	}


    render(){
        const { Data,image,title,type,music } = this.props.route.params;
		const {hidden}=this.props;
		const song=Data.map(item=>{
			return item.meta.audio_file
		})
		console.log("This is the sound",song)
        return(
          <View style={styles.container}>
			{Data.map(item=>(
                <ScrollView >
				<Image source={{uri:item.episode_featured_image}} style={{
		          width: '100%',
		          height:400,
	            }}/>
			
				<Text style={{color:'white',fontSize:25,marginTop:10,textAlign:'left'}}>{item.title.rendered.replace('&#8211;','-')}</Text>			
				<Text style={{color:'red',marginVertical:5}}>{item.type}</Text>
				<View style={styles.controls}>
					<TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
						{hidden ? (
							<Ionicons name='ios-pause' size={125} color='white' />
						) : (
							<Ionicons name='ios-play-circle' size={125} color='white' />
						)}
					</TouchableOpacity>
				</View> 
				</ScrollView>
			))}
          </View>
        )
    }
}


const mapDispatchToProps=dispatch=>({
	toggleCartHidden: ()=>dispatch(toggleCartHidden())
})

const mapStateToProps=createStructuredSelector({
	hidden:selectCartHidden
})

export default connect(mapStateToProps,mapDispatchToProps)(PodDetail);


const styles=StyleSheet.create({
    container: {
		flex: 1,
		backgroundColor: '#161616'
	},
	albumCover: {
		width: '100%',
		height:400,
		
	},
	trackInfo: {
		padding: 40,
		backgroundColor: '#fff'
	},
    Podcast:{
     color:'white',
	 fontSize:23,
	 margin:5
	},
	trackInfoText: {
		textAlign: 'center',
		flexWrap: 'wrap',
		color: '#550088'
	},
	largeText: {
		fontSize: 22
	},
	smallText: {
		fontSize: 16
	},
	control: {
		justifyContent:'center',
		alignItems:'center'
	},
	controls: {
		position:'absolute',
		top:'35%',
        left:'40%',
		flexDirection: 'row'
	},
	admob:{
		position:'absolute',
		top:'90%',
	}
})

