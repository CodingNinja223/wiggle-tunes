import React,{Component} from "react";
import {Text,Image,View,ScrollView,StyleSheet,TouchableOpacity} from 'react-native';
import moment from 'moment';
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
        const { Data } = this.props.route.params;
		console.log(Data);
		  const song=Data.map(item=>{
			  return item.meta.audio_file
		  })
		try {
			const playbackInstance = new Audio.Sound()
			const source = {
				uri: song[0]
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

		toggleCartHidden() ? await playbackInstance.stopAsync() : await playbackInstance.playAsync()
		this.setState({
			isPlaying: !isPlaying
		})

	}


    render(){
        const { Data } = this.props.route.params;
		const {hidden}=this.props;
		const {isPlaying}=this.state;
		console.log(hidden)
		const song=Data.map(item=>{
			return item.meta.audio_file
		})
		console.log(song[0])
        return(
          <ScrollView style={styles.container}>
            {Data.map(item=>(
				<View key={item.id}>
				<Image source={{uri:item.episode_featured_image}} style={styles.albumCover}/>
				<View style={styles.controls}>
					<TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
						{hidden ? (
							<Ionicons name='ios-pause' size={125} color='white' />
						) : (
							<Ionicons name='ios-play-circle' size={125} color='white' />
						)}
					</TouchableOpacity>
				</View> 
				<Text style={{color:'white'}}>{moment().format(`${item.date},MMM Do YY`)}</Text>
				<Text style={{color:'white'}}>{item.title.rendered}</Text>
				<Text style={{color:'white'}}>{item.type}</Text>
				</View>
			))}
          </ScrollView >
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
		height: 800,
		resizeMode:'contain'
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
	// control: {
	// 	margin: 20
	// },
	// controls: {
	// 	position:'absolute',
	// 	top:'35%',
    //     left:'30%',
	// 	flexDirection: 'row'
	// },
	admob:{
		position:'absolute',
		top:'90%',
	}
})

