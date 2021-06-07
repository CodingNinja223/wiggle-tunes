import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import AudioRecorderPlayer, {
     AVEncoderAudioQualityIOSType,
     AVEncodingOption,
     AudioEncoderAndroidType,
     AudioSet,
     AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Card,Header,Title,Button,Divider,Background} from 'react-native-paper'
import { Entypo,AntDesign} from '@expo/vector-icons'; 
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
            duration:'00:00:00'
        };
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09);
    }


   onStartRecord = async () =>{
       const path='hello.mp4';
       const audioSet={
              AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
              AudioSourceAndroid: AudioSourceAndroidType.MIC,
              AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
              AVNumberOfChannelsKeyIOS: 2,
              AVFormatIDKeyIOS: AVEncodingOption.aac,
       }
       const meteringEnabled = false; 
 console.log('audioSet',audioSet);
 const uri=await this.audioRecorderPlayer.startRecorder(path,audioSet,meteringEnabled );
 this.audioRecorderPlayer.addRecordBackListener((e) => {
          this.setState({
            recordSecs: e.currentPosition,
            recordTime: this.audioRecorderPlayer.mmssss(
              Math.floor(e.currentPosition),
            ),
          });
        });
console.log(`uri:${uri}`)
   }

   onStopRecord = async () =>{
    const result = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.setState({
          recordSecs: 0,
        });
        console.log(result);
   }

   onStartPlay = async (e) => {
        console.log('onStartPlay');
        const path = 'hello.mp4'
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
          this.audioRecorderPlayer.stopPlayer();
          this.audioRecorderPlayer.removePlayBackListener();
      }

    render(){
    return(
        <Card style={styles.container}>
            <View>
            <Text style={styles.color}>Record</Text>
            <Title style={styles.colortime}>{this.state.recordTime}</Title>
            <TouchableOpacity style={styles.flexContainer}  onPress={()=>this.onStartRecord()}>
            <Entypo name="controller-record" size={24} color="white" />
            <Text>{'  '}</Text> 
               <Text>{'  '}</Text>
              <Text style={styles.color}>RECORD</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.flexContainer}
              onPress={()=> this.onStopRecord()}
             >
             <Entypo name="controller-stop" size={24} color="white" />
             <Text>{'  '}</Text> 
               <Text>{'  '}</Text>
             <Text style={styles.color}>STOP</Text>
            </TouchableOpacity>
            <Divider/>
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
            </View>
        </Card>
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
        color:'white'
    }
})
export default VoiceMessage;