import React,{Component} from 'react';
import { StyleSheet, TouchableOpacity, View, Text,Dimensions,FlatList,ScrollView,ImageBackground,Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av';
import {WebView} from 'react-native-webview';
import {AdMobBanner} from 'expo-ads-admob';
import {Content, Card, CardItem, Thumbnail,  Button,Left, Body, } from 'native-base';
import moment from 'moment';


export default class Radio extends Component {
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
		const myScript =`(function() {
		const body=document.body.style.backgroundColor="#161616";
        const next=document.querySelector(".radioco_song").style.fontSize="35px";
		const next1=document.querySelector(".radioco_song").style.paddingTop="20px";
		const next2=document.querySelector(".radioco_song").style.lineHeight="1.5em";
		const next3=document.querySelector(".radioco_song").style.color="white";
		const previous=document.querySelector(".radioco_next").style.fontSize="30px";
		const previous1=document.querySelector(".radioco_next").style.paddingTop="20px";
		const previous2=document.querySelector(".radioco_next").style.color="white";
		const con=document.querySelectorAll('image').style.borderRadius="50px";
        })();`;

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
				  <View style={{backgroundColor:'white',width:'80%',height:1,marginHorizontal:40,opacity:0.1}}>
				 </View>
				 <View >
					<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
						<View style={{flexDirection:'row',marginLeft:10}}>
						<Text style={{fontWeight:'bold',color:'white'}}>PODCASTS</Text>
						<Text>{'  '}</Text>
						<Text style={styles.textColor}>|</Text>
						<Text>{'  '}</Text>
						<Text style={styles.textColor}>CRAZY 8</Text>
						</View>
						<TouchableOpacity style={{marginLeft:150}} onPress={()=>{
								this.props.navigation.navigate('Podcast')
							}}>
							<Text style={{color:'red'}} >See All</Text>
						</TouchableOpacity >
					</View>
					<View style={{marginTop:5}}>
					<FlatList
					  horizontal
					  pagingEnabled={true}
					  showsHorizontalScrollIndicator={false}
					  keyExtractor={item=>item.id.toString()}
					  data={this.state.podcast}
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
					
					</View>
				</View> 
			</ScrollView>
		)
	}
}

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
			width: 200,
			height: 200,
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
		left:'30%',
		top:'20%',
		zIndex:100,
		elevation: 20,
		flexDirection: 'row'
	},
	admob:{
		position:'absolute',
		top:'90%',
	}
})

/*
 

<View style={{height:'150%',padding:30}}>
				<WebView
				source={{
				uri: 'https://www.wiggletunes.co.za/Current-Song.html'
				}}
				injectedJavaScript={myScript}
				javaScriptEnabled={true}
				style={{width: Dimensions.get('window').width,height:800,resizeMode:'cover',position:'relative',right:25,bottom:25,top:0}}
				/>
				</View>

				 <View >
					<View style={{flexDirection:'row',justifyContent:'space-between',margin:5}}>
						<View style={{flexDirection:'row',marginLeft:10}}>
						<Text style={{fontWeight:'bold',color:'white'}}>PODCASTS</Text>
						<Text>{'  '}</Text>
						<Text style={styles.textColor}>|</Text>
						<Text>{'  '}</Text>
						<Text style={styles.textColor}>CRAZY 8</Text>
						</View>
						<View style={{marginLeft:180}}>
							<Text style={{color:'red'}}>See All</Text>
						</View>
					</View>
					<View style={{marginTop:40}}>
					<FlatList
					  horizontal
					  pagingEnabled={true}
					  showsHorizontalScrollIndicator={false}
					  keyExtractor={item=>item.id.toString()}
					  data={this.state.podcast}
					  renderItem={({item})=>(
                        <TouchableOpacity style={{margin:10}} onPress={()=>{
							navigation.navigate('Podcast Detail',{
								Data:item
							})
						}}>
							<View style={styles.box}>
                            <ImageBackground
							  source={{uri:item.episode_featured_image}}
							  style={styles.imagestyle}
							 />
							 </View>
							  <Text style={{color:'white',fontSize:6,marginLeft:10}}>{item.title.rendered}</Text> 
						</TouchableOpacity>
					  )}
					/>
					
					</View>
				</View> 

*/




/*
<View style={styles.container}>
		      
			// 	<Text style={styles.Podcast}>Popular Podcasts</Text>
			// 	<FlatList
			// 	horizontal
			// 	  pagingEnabled={true}
			// 	  showsHorizontalScrollIndicator={false}
			// 	  keyExtractor={item=>item.id.toString()}
            //       data={this.state.podcast}
			// 	  renderItem={({item})=>(
			// 	<TouchableOpacity onPress={()=>{
			// 	navigation.navigate('Podcast Detail',{
			// 			Data:item
			// 		})
			// 	}}>
			// 		<Content  key={item.id}>
			// 		<Card>
			// 		  <CardItem>
			// 			<Left>
			// 			  <Thumbnail source={{uri:item.episode_player_image }} />
			// 			  <Body>
			// 				<Text>{item.title.rendered}</Text>
			// 				<Text note>{item.type}</Text>
			// 			  </Body>
			// 			</Left>
			// 		  </CardItem>
			// 		  <CardItem cardBody>
			// 			<Image source={{uri:item.episode_featured_image}} style={{height: 200, width: null, flex: 1}}/>
			// 		  </CardItem>
			// 		  <CardItem>
			// 			<Left>
			// 			  <Button transparent>
			// 				<Text style={{color:'red'}}>{moment(item.date).format('ll')}</Text>
			// 				</Button>
			// 				<Button transparent>
			// 				  <Text style={{color:'red'}}>Durations:{' '}{item.meta.duration}</Text>
			// 				</Button>
			// 			</Left>
			// 			<Body>
						 
			// 			</Body>
			// 		  </CardItem>
			// 		</Card>
			// 	  </Content>
			// 	  </TouchableOpacity>
			// 	  )}				
			// 	  />
			// 	<AdMobBanner
			// 	style={styles.admob}
			// 	bannerSize="fullBanner"
			// 	adUnitID="ca-app-pub-4848737122422413/6221324032" // Test ID, Replace with your-admob-unit-id
			// 	servePersonalizedAds // true or false
			// 	onDidFailToReceiveAdWithError={this.bannerError} />
			// </View >


*/