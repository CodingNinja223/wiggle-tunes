import React,{Component} from "react";
import { RNCamera } from 'react-native-camera';
import {StyleSheet,Text,View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import RNFS from 'react-native-fs';
import {Camera} from '../redux/camera/camera.actions'
class Cameras extends Component{
    constructor(){
        super();
        this.state={

        }
    }

    takePicture = async ({addCamera}) => {
        if (this.camera) {
          const options = {base64:true,pauseAfterCapture:true,path: RNFS.DocumentDirectoryPath  + '/test.jpg'};
          const data = await this.camera.takePictureAsync(options);
          console.log("This is the data",data.uri);
          this.props.addCamera(data.uri)
        }
    };

    render(){
        return(
            <View style={styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
            />
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                <Text style={{ fontSize: 14,color:'white' }}> SNAP </Text>
              </TouchableOpacity>
            </View>
         
          </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: 'black',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });


  const mapDispatchToProps=dispatch=>({
    addCamera:item=>dispatch(Camera(item))
  })

export default connect(null,mapDispatchToProps)(Cameras);