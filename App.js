import React,{Component} from 'react'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import Watch from './src/screens/Watch';
import Podcast from './src/screens/Podcast'; 
import Review from './src/screens/Review';
import Shop from './src/screens/Shop';
import News from './src/screens/News';
import NewsDeatil from './src/screens/NewsDetails';
import { Ionicons, AntDesign , MaterialIcons,Entypo ,FontAwesome5  } from '@expo/vector-icons'; 
import RadioTabs from './src/screens/RadioTab';
import ProductDetail from './src/screens/ProductDetail';
import Feedback from './src/screens/Feedback';
import CustomDrawer from './src/screens/CustomDrawer';
import * as Notifications from 'expo-notifications';
import VoiceMessage from './src/screens/Voice-Message';
import VideoMessage from './src/screens/Video-message';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {selectCartItems, selectCartItemsCount} from './redux/cart/cart.selector'
import Checkout from './src/screens/Checkout';
import OneSignal from 'react-native-onesignal';
import SavedRecording from './src/screens/SavedRecordings';

const Stack=createStackNavigator();
const PrimaryNavigation=({navigation})=>{
return(
   <Stack.Navigator initialRouteName="Now Playing">
       <Stack.Screen name="Now Playing" component={RadioTabs}
        options={{
            
            headerLeft:()=>(
                <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
            ),
            headerStyle: {
                backgroundColor: 'black',
              },
            headerTintColor: '#fff',
        }}
       />
        <Stack.Screen name="Watch" component={Watch}  />
        <Stack.Screen name="Podcast" component={Podcast} />
   </Stack.Navigator>
 )
}
const NewsNavigator=({navigation})=>{
    return(
        <Stack.Navigator initialRouteName="News">
            <Stack.Screen name="News" component={News}  
                 options={{
                    headerRight:()=>(
                        <Entypo name="home" size={30} color="white"  onPress={()=>navigation.navigate('Now Playing')} />
                    ),
                    headerLeft:()=>(
                        <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                    ),
                    headerStyle: {
                        backgroundColor: 'black',
                      },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen name="Detail" component={NewsDeatil} options={({ route }) => ({ 
                title: route.params.headerTitle.replace(/&#8217;/g, "'"),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
                headerRight:()=>(
                    <Entypo name="home" size={30} color="white" />
                ),
                })} />
        </Stack.Navigator>
    )
}
const WatchNavigator=({navigation})=>{
    return(
        <Stack.Navigator>
            <Stack.Screen name="Watch" component={Watch}
               options={{
                headerLeft:()=>(
                    <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                ),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
            }}
            />
        </Stack.Navigator>
    )
}
const PodcastNavigator=({navigation})=>{
    return(
        <Stack.Navigator>
            <Stack.Screen name="Podcast" component={Podcast}
              options={{
                headerLeft:()=>(
                    <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                ),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
            }}
            />
        </Stack.Navigator>
    )
}
const Tab=createBottomTabNavigator();
const TabNavigation=()=>{
    return(
        <Tab.Navigator 
        initialRouteName="Now Playing"
        tabBarOptions={{
            activeTintColor: 'white',
            inactiveTintColor: 'gray',
            style:{
                backgroundColor:'black',
                color:'white'
            }
        }}
         screenOptions={({route})=>({
             tabBarIcon:({focused,color,size})=>{
                 let iconName;

                 if(route.name === 'Now Playing'){
                     iconName= focused 
                     ? 'play-circle'
                     :'play-circle-outline'
                 }else if(route.name === 'Watch'){
                    iconName=focused
                    ? 'tv'
                    : 'tv-outline'
                 }else if(route.name === 'Podcasts'){
                    iconName=focused
                    ? 'radio-sharp'
                    : 'radio-outline'
                 }

                 return <Ionicons name={iconName} size={25} color="white" /> 
             }
         })}
        >
             <Tab.Screen name="Now Playing" component={PrimaryNavigation}/>
             <Tab.Screen name="Watch" component={WatchNavigator}/>
             <Tab.Screen name="Podcasts" component={PodcastNavigator}/>
        </Tab.Navigator>
    )
}
const ShopNavigator=({navigation,itemCount})=>{
    return(
       <Stack.Navigator>
           <Stack.Screen name="Shop" component={Shop}  
              options={{
                headerRight:()=>(
                    <Entypo name="home" size={30} color="white"  onPress={()=>navigation.navigate('Now Playing')} />
                ),
                headerLeft:()=>(
                    <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                ),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
            }}
           />
           <Stack.Screen name="ProductDetail" component={ProductDetail} options={({ route }) => ({ 
                title: route.params.productTitle,
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff', 
                headerRight:()=>(
                 <Entypo name="shopping-cart" size={30} color="white"  onPress={()=>navigation.navigate('Cart')} />
                ),
                })}/>
            <Stack.Screen name="Cart" component={Checkout} options={{

                headerStyle:{
                    backgroundColor:'black'
                },
                headerTintColor: '#fff', 
            }} />
       </Stack.Navigator>
    )
}
const FeedbackNavigation=({navigation
})=>{
    return(
        <Stack.Navigator>
             <Stack.Screen name="Feedback" component={Feedback}  
            options={{
                headerRight:()=>(
                    <Entypo name="home" size={30} color="white" onPress={()=>navigation.navigate('Now Playing')}  />
                ),
                headerLeft:()=>(
                    <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                ),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
    )
}
const ReviewNavigation=({navigation})=>{
    return(
      <Stack.Navigator>
          <Stack.Screen name="Review" component={Review}  
            options={{
                headerRight:()=>(
                    <Entypo name="home" size={30} color="white" onPress={()=>navigation.navigate('Now Playing')} />
                ),
                headerLeft:()=>(
                    <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                ),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
            }}
          />
      </Stack.Navigator>
    )
}


const VoiceNavigation=({navigation})=>{
    return(
      <Stack.Navigator>
          <Stack.Screen name="Voice Message" component={VoiceMessage}  
            options={{
                headerRight:()=>(
                    <Entypo name="home" size={30} color="white" onPress={()=>navigation.navigate('Now Playing')} />
                ),
                headerLeft:()=>(
                    <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                ),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
            }}
          />
          <Stack.Screen name="Recordings" component={SavedRecording}/>
      </Stack.Navigator>
    )
}

const VideoNavigation=({navigation})=>{
    return(
      <Stack.Navigator>
          <Stack.Screen name="Video Message" component={VideoMessage}  
            options={{
                headerRight:()=>(
                    <Entypo name="home" size={30} color="white" onPress={()=>navigation.navigate('Now Playing')} />
                ),
                headerLeft:()=>(
                    <Ionicons name="menu" size={30} color="white" onPress={()=>navigation.openDrawer()}/>
                ),
                headerStyle: {
                    backgroundColor: 'black',
                  },
                headerTintColor: '#fff',
            }}
          />
      </Stack.Navigator>
    )
}


const Drawer =createDrawerNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

class App extends Component {
    constructor(){
        super();
        this.state={
          isReady:false,
          isSubscribed:true
        }
    }
  async  componentDidMount() {
        await Font.loadAsync({
          Roboto: require('native-base/Fonts/Roboto.ttf'),
          Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        });
        this.setState({ isReady: true });   
        
        
        /* O N E S I G N A L   S E T U P */
        OneSignal.setLogLevel(6, 0);
        OneSignal.setAppId("590075df-aaa1-4966-a1f8-25ba8bdcbc6b");
                
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            console.log("Prompt response:", response);
        });
        OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
            let notification = notificationReceivedEvent.getNotification();
            console.log("notification: ", notification);
            const data = notification.additionalData
            console.log("additionalData: ", data);
        });
        
        OneSignal.setInAppMessageClickHandler(respons=>{
            console.log("OneSignal IAM clicked:", respons);
        })

        OneSignal.setNotificationOpenedHandler(notification => {
            console.log("OneSignal: notification opened:", notification);
        });
        const deviceState = await OneSignal.getDeviceState();

        this.setState({
            isSubscribed : deviceState.isSubscribed
        });



     }
	render(){
        console.log(this.state.data)
        if(!this.state.isReady){
            return <AppLoading/>
        }
	return(
		<NavigationContainer>
           <Drawer.Navigator initialRouteName="Now Playing"
                drawerStyle={{
                     backgroundColor: 'black'
                }}
                 drawerContentOptions={{
                   activeTintColor:'white',
                   inactiveTintColor:'white'
                 }}
                  drawerContent={props=><CustomDrawer{...props}/>}
              >
               <Drawer.Screen name="Now Playing" component={TabNavigation} options={{
                   drawerIcon:()=>(
                    <Ionicons name="musical-notes" size={24} color="white" />
                   )

               }}/>
               <Drawer.Screen name="News" component={NewsNavigator}  options={{
                   drawerIcon:()=>(
                    <Ionicons name="newspaper-outline" size={24} color="white" />
                   )

               }}/>
               <Drawer.Screen name="Shop" component={ShopNavigator} options={{
                   drawerIcon:()=>(
                    <AntDesign name="shoppingcart" size={24} color="white" />
                   )

               }}/>
               <Drawer.Screen name="Feedback" component={FeedbackNavigation} options={{
                   drawerIcon:()=>(
                    <MaterialIcons name="feedback" size={24} color="white" />
                   )

               }} />
               <Drawer.Screen name="Send Voice message" component={VoiceNavigation} options={{
                   drawerIcon:()=>(
                    <MaterialIcons name="keyboard-voice" size={24} color="white" />
                   )

               }} />
                <Drawer.Screen name="Send Video Message" component={VideoNavigation} options={{
                   drawerIcon:()=>(
                    <FontAwesome5 name="video" size={24} color="white" />
                   )

               }} />
               <Drawer.Screen name="Rate this App" component={ReviewNavigation} options={{
                   drawerIcon:()=>(
                    <MaterialIcons name="star-rate" size={24} color="white" />
                   )

               }}/>
           </Drawer.Navigator>
        </NavigationContainer>
	)
}
}


const mapStateToProps=createStructuredSelector({
    itemCount:selectCartItemsCount
})

export default connect(mapStateToProps)(App);