import React,{Component} from 'react';
import { StyleSheet, TouchableOpacity, View, Text,Dimensions,FlatList,ScrollView,ImageBackground,Image } from 'react-native'
import { Ionicons, AntDesign,Entypo } from '@expo/vector-icons'
import { Audio } from 'expo-av';
import {connect} from 'react-redux';
import {AdMobBanner} from 'expo-ads-admob';
import { SoundCard} from '../../redux/sound/sound';
import { createStructuredSelector } from 'reselect';
import {selectPodcastData} from '../../redux/sound/sound.selectors';

 class Radio extends Component {
	state = {
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

	async componentDidMount() {
		const response = await fetch('https://wiggletunes.co.za/wp-json/wp/v2/podcast');
		const data = await response.json();
		console.log('This is the data',data)

		this.props.SoundCard(data);
		this.setState({
		  podcast:[...data],
		  isLoading:false
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
				uri: 'https://s3.radio.co/s353f67c4a/listen'
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

	render() {
		const {navigation}=this.props;

		return (
			<ScrollView style={styles.container}>
                  <View style={styles.box}>
					 <Image source={require('../img/cover-art.jpg')} style={{width:'99%',height:500,borderRadius:20,resizeMode:'contain'}}/>
				   </View>
				<View style={styles.controls}>
					<TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
						{this.state.isPlaying ? (
							<Ionicons name='ios-pause' size={125} color='white' />
						) : (
							<Ionicons name='ios-play-circle' size={125} color='white' />
						)}
					</TouchableOpacity>
				</View> 
				<AdMobBanner
                  style={{width:'100%',height:50}}
                  bannerSize="fullBanner"
                  adUnitID="ca-app-pub-4848737122422413/6221324032" // Test ID, Replace with your-admob-unit-id
                  servePersonalizedAds // true or false
                  onDidFailToReceiveAdWithError={this.bannerError} />
				  <View style={{backgroundColor:'white',width:'80%',height:1,marginHorizontal:40,opacity:0.1}}>
				 </View>
				 <View >
					<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
						<View style={{flexDirection:'row',marginLeft:10}}>
						<Text style={{fontWeight:'bold',color:'white'}}>PODCASTS</Text>
						<Text>{'  '}</Text>
						<Text style={styles.textColor}>|</Text>
						<Text>{'  '}</Text>
						<Text style={{fontWeight:'bold',color:'white'}}>Episodes</Text>
						</View>
						<TouchableOpacity style={{marginLeft:150}} onPress={()=>{
								this.props.navigation.navigate('Podcast')
							}}>
							<Text style={{color:'red'}}>See All</Text>
						</TouchableOpacity >
					</View>
					<View style={{marginTop:5}}>
					<FlatList
					  horizontal
					  pagingEnabled={true}
					  showsHorizontalScrollIndicator={false}
					  keyExtractor={item=>item.id}
					  data={this.props.itemC}
					  renderItem={({item})=>(
                        <TouchableOpacity style={{margin:10}} onPress={()=>{
							navigation.navigate('Podcast Detail',{
								Data:[item]							
							})
						}}>
							<View style={styles.box}>
                            <ImageBackground
							  source={{uri:item.episode_featured_image}}
							  style={styles.imagestyle}
							 />
							 </View>
						</TouchableOpacity>
					  )}
					/>
					
					</View>
				</View> 
				<View style={styles.header}>
				<View style={{flexDirection:'row',padding:15}}>
					<View>
				     	<Image source={require('../img/icon.png')} style={{width:50,height:50,position:'absolute',left:340,bottom:40}}/>
                         <Text style={{color:'white',position:'absolute',left:110,top:8}}>Powered by Wiggle Digital Ltd.</Text>
					</View>
					<TouchableOpacity style={{marginBottom:20}} onPress={this.handlePlayPause}>
						{ this.state.playing 
						? 
						 (<AntDesign name="pause" size={35} color="white"  style={{paddingBottom:25}}/>)
						 :
						 (<Entypo name="controller-play" size={35} color="white" style={{paddingBottom:25}} />)
						}
					</TouchableOpacity>	   
				</View>
				</View>
			</ScrollView>
		)
	}
}

const mapDispatchToProps = dispatch =>({
 SoundCard:item =>dispatch(SoundCard(item))
})

const mapStateToProps=createStructuredSelector({
 itemC:selectPodcastData
})


const styles = StyleSheet.create({
	container: {
		backgroundColor: '#161616'
	},
	imagestyle:{
		width:200,
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
		overflow:'visible',
		shadowColor: "#ffffff",
		shadowOffset: {
			width: 400,
			height: 400,
		},
		shadowOpacity: 0.58,
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
		left:'30%',
		top:'20%',
		zIndex:100,
		elevation: 20,
		flexDirection: 'row'
	},
	admob:{
		position:'absolute',
		top:'90%',
	},
	header:{
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.39,
		shadowRadius: 8.30,

		elevation: 13,
		backgroundColor:'black',
		height:60,
	}
})


export default connect(mapStateToProps,mapDispatchToProps)(Radio);