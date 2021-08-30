import React,{Component} from 'react';
import {View,Text,StyleSheet,Linking,TouchableOpacity,Platform,PermissionsAndroid,TextInput,Image,ImageBackground,ScrollView,Dimensions,Alert} from 'react-native';
import AudioRecorderPlayer, {
     AVEncoderAudioQualityIOSType,
     AVEncodingOption,
     AudioEncoderAndroidType,
     AudioSet,
     AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Card,Title,Divider} from 'react-native-paper'
import { Entypo,AntDesign, Octicons ,Ionicons,FontAwesome5,MaterialIcons,MaterialCommunityIcons} from '@expo/vector-icons'; 
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import RNSmtpMailer from "react-native-smtp-mailer";
import { RNCamera } from 'react-native-camera';
import {AdMobBanner} from 'expo-ads-admob';
import RNFS from 'react-native-fs';
import {db} from '../util/firebase'
import {launchCamera,launchImageLibrary} from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import * as Progress from 'react-native-progress';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment'
import {getStorage,ref} from 'firebase/firebase-storage';



class VoiceMessage extends Component {
  constructor(props){
    super(props)
    this.state={
        isLoggedIn:false,
        recordSecs:0,
        recordTime:'00:00:00',
        currentPositionSec:0,
        currentDurationSec:0,
        playTime:'00:00:00',
        duration:'00:00:00',
        recordingdata:'',
        isRecording:false,
        visible:false,
        comments:'',
        time:new Date().toISOString(),
        image:'',
        uploading:false,
        transferred:0,
        start:false,
        options:false,
        attachment:'',
        whatsAppMessageComments:[]
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09);
}

async componentDidMount(){

  const snapshot = await db.collection('Comments').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
    const data=[];
    data.push({id:doc.id,data:doc.data()})
    this.setState({
      whatsAppMessageComments:[...data],
      options:true
    })
  });

  if (Platform.OS === 'android') {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
  
      console.log('write external stroage', grants);
  
      if (
        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted');
      } else {
        console.log('All required permissions not granted');
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  }
}

onStartRecord = async () =>{
  const audioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  };
  const date= new Date();
  console.log('audioSet',audioSet);
  const path = RNFS.DocumentDirectoryPath + `/audio.mp4`;
  console.log(path)
  const uri=await this.audioRecorderPlayer.startRecorder(path,audioSet,null);
  this.audioRecorderPlayer.addRecordBackListener((e) => {
    console.log('Recording . . . ', e.currentPosition);
     this.setState({
       recordSecs: e.currentPosition,
       recordTime: this.audioRecorderPlayer.mmssss(
         Math.floor(e.currentPosition),
       ),
     });
   });
  console.log(`uri:${uri}`)
  this.setState({
    isRecording:true
  })
}


addAttachment =()=>{
  const options = {
    title:'',
    mediaType:'mixed',
    path: RNFS.DocumentDirectoryPath  + '/test.jpg',
    maxWidth: 2000,
    maxHeight: 2000,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

  launchImageLibrary(options,response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {

       const source =  response.assets;

       console.log(source);
        this.setState({
         attachment:source
        })

        const item = source.map(item=>{
          console.log("this is the item",item.uri);
         })

     

        const reference= storage().ref('images/');
        const task=reference.putFile(`${utils.FilePath.PICTURES_DIRECTORY}`);
        
        task.then((res) => {
          console.log(res);
        })
    
    }
  });
}

 selectImage = () => {
  const options = {
     title:'WhatsApp Image',
     mediaType:'photo',
     storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

  launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      
      const source=response.uri;
      console.log(source);
       this.setState({
        image:source
      })

      let reference=storage().ref('images');
      let task=reference.putFile(source);

      task.then(()=>{
           console.log('Image upload');
      }).catch((e)=>{
        console.log('this is the plan');
      })
    }   
  });


};


uploadImage = async () => {
  const { uri } = image;
  const filename = uri.substring(uri.lastIndexOf('/') + 1);
  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  this.setState({uploading:true})
  this.setState({transferred:0})
    
    storage()
    .ref(filename)
    .putFile(uploadUri);

  task.on('state_changed', snapshot => {
    setTransferred(
      Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
    );
  });
  try {
    await task;
  } catch (e) {
    console.error(e);
  }
  Alert.alert(
    'Photo uploaded!',
    'Your photo has been uploaded to Firebase Cloud Storage!'
  );

  this.setState({image:null})
};


onStopRecord = async () =>{
const result = await this.audioRecorderPlayer.stopRecorder();
   this.audioRecorderPlayer.removeRecordBackListener();
   this.setState({
     recordSecs: 0,
   });
   console.log(result);
   this.setState({
    recordingdata:result
   })
   this.setState({
     start:true
   })

   this.setState({
    isRecording:false
  })
  // let storageRef=storage.ref();
  // let metadata={
  //   contentType:'audio/mp4'
  // }
  
  // let filePath=this.state.recordingdata;
  // const voiceRef=storageRef.child(`voices/${this.state.recordingdata}`)
  // let blob=new Blob([filePath],{type:'audio/mp3'});
  // voiceRef.put(blob);
    
}

onStartPlay = async (e) => {
   console.log('onStartPlay');
   const path = this.state.recordingdata
   const msg = await this.audioRecorderPlayer.startPlayer(path);
   this.audioRecorderPlayer.setVolume(1.0);
   console.log(msg);
   this.audioRecorderPlayer.addPlayBackListener((e) => {
     if (e.current_position === e.duration) {
       console.log('finished');
       this.audioRecorderPlayer.stopPlayer();
     }
     this.setState({
       currentPositionSec: e.current_position,
       currentDurationSec: e.duration,
       playTime: this.audioRecorderPlayer.mmssss(
         Math.floor(e.current_position),
       ),
       duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),

     });
   });
 };

 

 onPausePlay = async (e) =>{
     await this.audioRecorderPlayer.pausePlayer();
 }

 onStopPlay = async (e)=>{
     console.log('onStopPlay');
     try{
      this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
     }
     catch (error) {
      console.error(error);
    }
    
 }

 ViewRecordings=()=>{
   this.props.navigation.navigate('Recordings');
 }

 sendComment= async ()=>{
  await db.collection("Comments")
  .add({
    comments:this.state.comments
  })

  this.setState({
    comments:''
  })
 
Linking.openURL(`whatsapp://send?text=${this.state.comments}&phone=+27660576802`)

 }

 sendMessage=()=>{
  
  const date= new Date();
  RNSmtpMailer.sendMail({
    mailhost: "smtp.wiggletunes.co.za",
    port: "587",
    ssl: false, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
    username: "transport@wiggletunes.co.za",
    password: "WigTr@123%_12",
    fromName: "transport@wiggletunes.co.za", // optional
    replyTo: "coder@wiggledigital.co.za", // optional
    recipients: "producer@wiggletunes.co.za,studio@wiggletunes.co.za",
    subject: "Wiggle Tunes Audio Recording",
    htmlBody: "<h1>Auido Recoridng</h1><p>Auido Recoridng</p>",
    attachmentPaths: [
      RNFS.DocumentDirectoryPath + `/audio.mp4`
    ], // optional
    attachmentNames: [
      `${date}.mp4`,
    ], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
  })
  .then(success => console.log(success))
  .catch(err => console.log(err));
    Alert.alert(
      "Voice message was sent"
    );

    this.setState({
      start:false
    })
}

    render(){
      console.log(this.state.recordingdata)
      const path = RNFS.DocumentDirectoryPath + `/audio.mp4`;
      const {width, height} = Dimensions.get('window');
       console.log("this is a whatsApp comment",this.state.whatsAppMessageComments)
    return(
      <ScrollView contentContainerStyle={{flex:1}}>
      <ImageBackground source={require('../img/wallpaper.jpg')} style={{width:'100%',height:'100%'}}>
          <ScrollView contentContainerStyle={{justifyContent:'flex-end',alignItems:'flex-end'}}>
                 {  this.state.options === true ?
                 (
                   <View style={{margin:20,backgroundColor:'#bb0a21',padding:35,borderRadius:10,justifyContent:'flex-start'}}>
                       <Text style={{color:'white'}}>Thank you for contacting Wiggle Tunes, your message has been received</Text>
                   </View>
                 ):(
                   null
                 )
                 }
                {this.state.options === true ? 
                (<View>
                   {this.state.whatsAppMessageComments.map(item=>{
                          return(
                            <View style={{margin:20,backgroundColor:'#7a9b76',padding:5,borderRadius:10}}>
                            <Text key={item.id} style={{color:'white'}}>{item.data.comments}</Text>
                            <Text>{moment().format(`MMMM Do YYYY, h:mm:ss a`)}</Text>
                            </View>
                            )
                        })}
                </View>) 
                : 
                ( 
                  <View>
                      
                       
                  </View>
                )
                }
              {/* <Image source={{uri:this.state.image}}/>
              <Image source={{uri:this.state.attachment}}/> */}
               {/* <View style={styles.imageContainer}>
                  {this.state.image !== null ? (
                    <Image source={{ uri: image.uri }} style={styles.imageBox} />
                  ) : null}
                  {this.state.uploading ? (
                    <View style={styles.progressBarContainer}>
                      <Progress.Bar progress={transferred} width={300} />
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.uploadButton} onPress={()=>this.uploadImage()}>
                      <Text style={styles.buttonText}>Upload image</Text>
                    </TouchableOpacity>
                  )}
                </View> */}
          </ScrollView>
          <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Title style={this.state.start ? styles.colortime : {display:'none'}}>{this.state.recordTime}</Title>
                      <View style={{flexDirection:'row'}}>
                      <TouchableOpacity style={this.state.start ? {fontWeight:'bold',margin:10} : {display:'none'}} onPress={()=> this.onStartPlay()}>
                        <AntDesign name="play" size={35} color="red" />
                        {/* <Text style={styles.color}>PLAY</Text>  */}
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.start ? {fontWeight:'bold',margin:10} : {display:'none'}} >
                          <MaterialIcons name="send" size={35} color="red"  onPress={()=>this.sendMessage()}/>
                      </TouchableOpacity>
                  </View>
          </View>
       <View >

        <View style={{flexDirection:'column',justifyContent:'flex-end',alignItems:'flex-end',margin:5}}>
            <MaterialCommunityIcons name="attachment" size={35} color="grey"  onPress={()=>this.addAttachment()}/> 
            <MaterialIcons name="photo-camera" size={35} color="grey"  onPress={()=>this.selectImage()}/>
                  { this.state.isRecording === false ?(  
                    <Entypo name="controller-record" style={{marginLeft:20}}  size={35} color="gray" onPress={()=>this.onStartRecord()}/>
                    )
                    :
                    (
                    <Entypo name="controller-stop" style={{marginLeft:20}}  size={35} color="grey"  onPress={()=> this.onStopRecord()} />
                    )}
            <MaterialIcons name="send" size={35} color="gray" onPress={()=>this.sendComment()}/>
        </View>
  
      <View style={{margin:5}}>
        <TextInput  
            onChangeText={(val)=>{this.setState({comments:val})}}
           style={{width:'100%',borderRadius:30,backgroundColor:'white'}}
            />
      </View>
     
       </View>
      
        </ImageBackground>
        </ScrollView>
    )
}
}


const styles=StyleSheet.create({
    container:{
    flex:1,
    backgroundColor:'black',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    alignSelf:'center'
    },
    color:{
        color:'red',
        marginRight:10,
        textAlign:'center',
        fontWeight:'bold',
        fontSize:10
          },
    flexContainer:{
        flexDirection:'row',
        backgroundColor:'red',
        justifyContent:'center',
        borderRadius:30,
        padding:10,
        margin:5
    },
    colortime:{
        textAlign:'center',
        color:'red',
        marginTop:20,
        fontSize:30
    },
    flexContainer2:{
      flexDirection:'row',
      backgroundColor:'white',
      justifyContent:'center',
      borderRadius:30,
      padding:10,
      margin:5,
      
  },
  color2:{
    color:'black'
  },
  circleRecord:{
    borderRadius:800,
    borderWidth:2,
    borderColor:'red',
    padding:50,
    width:210,
    height:200
  },
  containerStyle:{
    backgroundColor: 'black',
     padding: 20
  },
  flexContainersave:{
    justifyContent:'center',
    alignItems:'center',
    marginVertical:10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6'
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 300,
    height: 300
  }
})
export default VoiceMessage;

//earlmh@gmail.com
  {/* <Card style={styles.container}> */}
            {/* <View >
               <View style={{justifyContent:'center',alignItems:'center',flex:1,marginTop:100}}>
               <Text style={{color:'white',fontSize:40,textAlign:'center',position:'absolute',right:150,bottom:10}}>                  <Entypo name="controller-record" size={40} color="red" onPress={()=>this.onStartRecord()} style={{marginBottom:15}}/>
REC</Text>
               
                       <Title style={styles.colortime}>{this.state.recordTime}</Title>
                 
               </View>
            </View> */}
            {/* <View style={{justifyContent:'center',alignItems:'center',marginTop:200}}>
                 
              </View> */}
          {/* <View style={{justifyContent:'center',alignItems:'center',flex:1,margin:5}}>
            <View  style={{borderColor:'white',borderWidth:1,padding:10,width:300,borderRadius:10}}>
              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
            <TouchableOpacity style={{fontWeight:'bold',marginTop:5}} onPress={()=> this.onStartPlay()}>
             <AntDesign name="play" size={50} color="red" />
               <Text style={styles.color}>PLAY</Text> 
            </TouchableOpacity>
                <View style={{marginTop:5}}>
                    { this.state.isRecording === false ?(  <TouchableOpacity  >
                  <Entypo name="controller-record" style={{marginLeft:20}}  size={50} color="red" onPress={()=>this.onStartRecord()}/>
                  <Text style={{color:'red',fontWeight:'bold'}}>Record/STOP</Text> 
                  </TouchableOpacity>
                  )
                  :
                  (<TouchableOpacity >
                  <Entypo name="controller-stop" style={{marginLeft:20}}  size={50} color="red" onPress={()=> this.onStopRecord()} />
                  <Text style={{color:'red',fontWeight:'bold'}}>Record/STOP</Text> 
                  </TouchableOpacity>)}
                   
                </View>
                <TouchableOpacity 
                style={{marginTop:5}} 
                 onPress={()=>this.sendMessage()}
                >
               <MaterialIcons name="send" size={50} color="red"/>
                <Text style={styles.color}>SEND</Text>
            </TouchableOpacity>
              </View>
            </View>
          </View> */}
          {/* <AdMobBanner
                  style={{width:'100%',height:200}}
                  bannerSize="fullBanner"
                  adUnitID="ca-app-pub-4848737122422413/6221324032"
                  servePersonalizedAds 
                  onDidFailToReceiveAdWithError={this.bannerError} /> */}
          {/* <Portal>
            <Modal visible={this.state.visible} onDismiss={this.hideModal} style={styles.containerStyle}>
               <Text style={styles.colortime}>Save recording</Text>
              <View style={styles.flexContainersave}>
                  <Text style={styles.colortime}>{this.state.recordingdata}</Text>
              </View>
              <View style={styles.flexContainersave}>
                  <TouchableOpacity onPress={this.saveRecording} style={{ backgroundColor:'transparent',justifyContent:'center',borderRadius:30,padding:10,margin:5,borderColor:'red',borderWidth:2,width:200}}>
                     <Text style={{color:'white',textAlign:'center'}}>Save</Text>
                  </TouchableOpacity>
              </View>
            </Modal>
          </Portal> */}
            {/* <Title style={styles.colortime}>{this.state.playTime} / {this.state.duration}</Title>
            <TouchableOpacity
            style={styles.flexContainer}
             onPress={()=>this.onPausePlay()}
             >
                <AntDesign name="pause" size={24} color="white" />
                <Text>{'  '}</Text> 
               <Text>{'  '}</Text>
              <Text style={styles.color}>PAUSE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.flexContainer} 
             onPress={()=>this.onStopPlay()}
             >
                <Entypo name="controller-stop" size={24} color="white" />
                <Text>{'  '}</Text> 
               <Text>{'  '}</Text>
                <Text style={styles.color}>STOP</Text>
            </TouchableOpacity>
             */}
           
        {/* </Card> */}