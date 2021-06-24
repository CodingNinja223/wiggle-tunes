import React,{Component} from 'react';
import {View,Text,StyleSheet,Linking,Image,ScrollView,TouchableOpacity,RefreshControl,SafeAreaView} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import {db} from '../util/firebase';



class Notifications extends Component{
    constructor(){
        super()
        this.state={
           Notification:[],
           refreshing:false
        }
    }

 wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

 onRefresh=()=>{
    this.setState({
        refreshing:true
    })
    this.wait(3000).then(()=>this.setState({refreshing:false}))
}

async componentDidMount(){
    const snapshot = await db.collection('Notifications').get();
    const pushData =[];
    snapshot.forEach((doc)=>{
        console.log(`This data from the database`,doc.data(),doc.id)
        pushData.push({Data:doc.data(),id: doc.id })
        this.setState({
            Notification:[...pushData]
        })
    })
    this.state.Notification.map(item=>{
        item.Data.Notification.map(item=>{
            console.log(`this is working or not`,item.notification.title)
        })
    })
}

deleteNotification=async(id)=>{
    const snapshot = await db.collection('Notifications').get();
    snapshot.forEach((doc)=>{
        db.collection('Notifications').doc(doc.id).delete();
    })
    console.log('deleted',id)
}

    render(){
  const id=this.state.Notification.map(item=>{
      return item.id;
  })
  console.log(this.state.Notification);
        return(
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.container}>
                        {this.state.Notification.map(item=>(
                            item.Data.Notification.map(item=>(
                             <View key={item.androidNotificationId} style={styles.card}>
                                    <TouchableOpacity  style={{justifyContent:'flex-end',alignItems:'flex-end'}} >
                                    <AntDesign name="close" size={24} color="black" onPress={ this.deleteNotification.bind(this,id)} />
                                    </TouchableOpacity>
                                <Text style={{color:'black',textAlign:'center',fontSize:25}} >{item.notification.title}</Text>
                                <Text style={{color:'black',textAlign:'center'}} >{item.notification.body}</Text>
                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                <Image source={{uri:`${item.notification.bigPicture}`}} style={{height:100,width:200,marginTop:10}}/>
                                </View>
                            </View>
                            ))
                        ))}
                 </View>
            </ScrollView>
        )
    }
}









const styles=StyleSheet.create({
    container1: {
        flex: 1,
        marginTop: 62,
      },
    container:{
        backgroundColor:'black',
        flex:1
    },
    color:{
        color:'white',
        textAlign:'center'
    },
    card:{
        shadowColor: "red",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        backgroundColor:'white',
        margin:10,
        borderRadius:10,
        padding:25,
        width:400
    }
})


export default Notifications;