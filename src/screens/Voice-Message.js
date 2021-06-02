import React,{Component} from 'react';
import {View,Text,StyleSheet,Button,TouchableOpacity} from 'react-native';
import {Audio} from 'expo-av';
class VoiceMessage extends Component {
    constructor(){
        super()
        this.state={
            sound:'',
            play:''
        }
    }

    playsound = async ()=>{
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync({
             uri:this.state.play
        });
        this.setState({
         play:sound
        })
    
        console.log('Playing Sound');
        await sound.playAsync();
    }

      async componentDidMount(){
             return this.state.sound
             ? ()=>{
                console.log('Unloading Sound');
                sound.unloadAsync(); }
                :undefined;
      }

     startRecording= async ()=>{  
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: true,
              playsInSilentModeIOS: true,
            }); 
            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync(); 
            this.setState({
                sound:recording
            })
            console.log('Recording started');
          } catch (err) {
            console.error('Failed to start recording', err);
          }
    }

    stopRecording = async ()=>{
      console.log('Stopping recording....');
      this.setState({
          sound:undefined
      })
    
      const recording = new Audio.Recording();
      await recording.stopAndUnloadAsync();
      const uri=recording.getURI();
      console.log('Recording stopped and stored at', uri) 
    }

    render(){
        const {sound,play}=this.state;
        console.log(sound);
        console.log(play);
    return(
        <View style={styles.container}>
            <View style={{margin:10}}>
            <TouchableOpacity style={styles.buttonContainer} onPress={sound ? this.stopRecording : this.startRecording}>
                <Text style={styles.textColor}>{sound ? 'Stop Recording' : 'Start Recording'}</Text>
            </TouchableOpacity>
            </View>
            <View style={{margin:10}}>
            <TouchableOpacity style={styles.buttonContainer} onPress={sound ? this.stopRecording : this.startRecording}>
                <Text style={styles.textColor}>{play ? 'Play Recording' : 'Pause Recording'}</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}
}


const styles=StyleSheet.create({
    container:{
    backgroundColor:'black',
    flex:1,
    justifyContent:'center',
    alignItems:'center'
    },
    textColor:{
        color:'white'
    },
    buttonContainer:{
        backgroundColor:"#a80404",
        padding:20,
        borderRadius:20
    }
})

export default VoiceMessage;