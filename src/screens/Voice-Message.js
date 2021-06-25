import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Platform,PermissionsAndroid,TextInput} from 'react-native';
import AudioRecorderPlayer, {
     AVEncoderAudioQualityIOSType,
     AVEncodingOption,
     AudioEncoderAndroidType,
     AudioSet,
     AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Card,Title,Divider} from 'react-native-paper'
import { Entypo,AntDesign, Octicons } from '@expo/vector-icons'; 
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import RNSmtpMailer from "react-native-smtp-mailer";
import {storage} from '../util/firebase';


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
        visible:false
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09);
}

async componentDidMount(){
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

  console.log('audioSet',audioSet);
  
  const uri=await this.audioRecorderPlayer.startRecorder(null,audioSet,null);
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
    isRecording:false
  })
  let storageRef=storage.ref();
  let metadata={
    contentType:'audio/mp4'
  }
  
  let filePath=this.state.recordingdata;
  const voiceRef=storageRef.child(`voices/${this.state.recordingdata}`)
  let blob=new Blob([filePath],{type:'audio/mp3'});
  voiceRef.put(blob);
    
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

 sendMessage=()=>{
  const path=this.state.recordingdata;

  RNSmtpMailer.sendMail({
    mailhost: "129.232.249.150",
    port: "587",
    ssl: false, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
    username: "transport@wiggletunes.co.za",
    password: "WigTr@123%_12",
    fromName: "transport@wiggletunes.co.za", // optional
    replyTo: "coder@wiggledigital.co.za", // optional
    recipients: "coder@wiggledigital.co.za",
    subject: "Wiggle Tunes Audio Recording",
    htmlBody: "<h1>Auido Recoridng</h1><p>Auido Recoridng</p>",
    attachmentPaths: [
     path
    ], // optional
    attachmentNames: [
      "audio.mp4",
    ], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
  })
  .then(success => console.log(success))
  .catch(err => console.log(err));
 }

    render(){
      console.log(this.state.recordingdata)
    return(
      <Provider>
        <Card style={styles.container}>
            <View>
               <View style={{justifyContent:'center',alignItems:'center',flex:1,marginTop:200}}>
                  <View style={styles.circleRecord}>
                       <Title style={styles.colortime}>{this.state.recordTime}</Title>
                  </View>
               </View>
            </View>
            
          <View style={{justifyContent:'flex-end',alignItems:'center',flex:1}}>
            <View style={{flexDirection:'row'}}>
                <View >
                <TouchableOpacity onPress={()=>this.ViewRecordings()}>
                <Entypo name="menu" size={35} color="red"  />
                </TouchableOpacity>
                </View>
                <View>
                    { this.state.isRecording === false ?(  <TouchableOpacity >
                  <Entypo name="controller-record" size={35} color="red" onPress={()=>this.onStartRecord()} style={{marginBottom:15}}/>
                  </TouchableOpacity>)
                  :
                  (<TouchableOpacity>
                  <Entypo name="controller-stop" size={35} color="red" onPress={()=> this.onStopRecord()} style={{marginBottom:15}}/>
                  </TouchableOpacity>)}
                </View>
            </View>
          </View>
         
          <Portal>
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
          </Portal>
            <Title style={styles.colortime}>{this.state.playTime} / {this.state.duration}</Title>
            <TouchableOpacity style={styles.flexContainer}  onPress={()=> this.onStartPlay()}>
             <AntDesign name="play" size={24} color="white" />
               <Text>{'  '}</Text> 
               <Text>{'  '}</Text>  
               <Text style={styles.color}>Play</Text>
            </TouchableOpacity>
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
            <TouchableOpacity 
            style={styles.flexContainer} 
             onPress={()=>this.sendMessage()}
             >
                <Entypo name="controller-stop" size={24} color="white" />
                <Text>{'  '}</Text> 
               <Text>{'  '}</Text>
                <Text style={styles.color}>SEND RECORDING</Text>
            </TouchableOpacity>
           
        </Card>
        </Provider>
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
        color:'white',
        marginVertical:5,
        textAlign:'center'
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
        marginTop:20
    },
    flexContainer2:{
      flexDirection:'row',
      backgroundColor:'white',
      justifyContent:'center',
      borderRadius:30,
      padding:10,
      margin:5
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
  }
})
export default VoiceMessage;