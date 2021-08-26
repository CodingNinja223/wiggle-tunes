import React,{Component} from 'react';
import {AppState,Button,View,Text,StyleSheet,Linking,Image,ScrollView, ActivityIndicator,TouchableOpacity,FlatList,RefreshControl,SafeAreaView} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { Avatar,Card, Title, Paragraph } from 'react-native-paper';
import {db} from '../util/firebase';
import {AdMobBanner} from 'expo-ads-admob';
import RNRestart from 'react-native-restart';
import App from '../../App';



class Notifications extends Component{
    constructor(){
        super()
        this.state={
           Notification:[],
           refreshing:false,
           isLoading:true,
           refreshValue:1
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
    snapshot.forEach(async (doc)=>{
        console.log(`This data from the database`,doc.data(),doc.id)
        pushData.push({Data:doc.data(),id: doc.id })
        this.setState({
            Notification:[...pushData],
            isLoading:false
        })
    })
    this.onRefresh();
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
         if(this.state.isLoading){
             return(
                 <View style={styles.container}>
                       <ActivityIndicator size="large" color="red" />
                 </View>
             )
         }
        return(
            <View style={styles.container}>
               <Button title="Refresh" color="red" onPress={()=>RNRestart.Restart()}/>
               <FlatList
               refreshControl={
                   <RefreshControl
                     refreshing={this.state.refreshing}
                     onRefresh={this.onRefresh}
                   />
               }

            data={this.state.Notification}
            keyExtractor={(item)=>item.id}
            renderItem={({item})=>(
            <View style={{margin:20,backgroundColor:'white'}}> 
                <View style={{padding:10}}>    
                    <View style={{flexDirection:'row',justifyContent:'space-between',margin:5}}>
                        <View style={{flexDirection:'row'}}>
                           <Text style={{color:'red'}}>Notification</Text>
                           <Text>{'  '}</Text>
                           <Text>{'  '}</Text>
                           <AntDesign name="heart" size={13} color="red" style={{marginTop:5}}/>
                        </View>
                        <TouchableOpacity   >
                               <AntDesign name="close" size={20} color="black" onPress={ this.deleteNotification.bind(this,id)} />
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Image source={{uri:`${item.Data.image}`}} style={{width:50,height:50}}/>
                            </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View>
                            <Text style={{margin:5,color:'black'}}>{item.Data.title}</Text>
                            <Text style={{margin:5}}>{item.Data.body}</Text>
                        </View>
                        <View>
                        </View>
                    </View>
                    
                </View>
            </View>
            )}
   />
                 <AdMobBanner
                  style={{width:'100%',height:200}}
                  bannerSize="fullBanner"
                  adUnitID="ca-app-pub-4848737122422413/6221324032" // Test ID, Replace with your-admob-unit-id
                  servePersonalizedAds // true or false
                  onDidFailToReceiveAdWithError={this.bannerError} />
   </View>
        )
    }
}









const styles=StyleSheet.create({
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