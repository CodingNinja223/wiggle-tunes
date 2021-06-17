import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import VideoRecorder from 'react-native-beautiful-video-recorder';


const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

class VideoMessage extends Component{
  constructor(){
    super()
    this.state={
      data:null
    }
  }

  start =()=>{
     //30 seconds
     this.videoRecorder.open({maxLength:30},(data)=>{
       console.log('captured data', data)
       this.setState({
         data:data
       })
     })
  }


  render(){
    return(
      <View style={styles.container}>
       
      </View>
    )
  }
}

export default VideoMessage;

const styles=StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
})