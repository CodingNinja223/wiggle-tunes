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
import { Ionicons, AntDesign , MaterialIcons,Entypo ,FontAwesome5,FontAwesome   } from '@expo/vector-icons'; 
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
import PushNotifications from './src/screens/notifications';
import {db} from './src/util/firebase';
import PodDetail from './src/screens/Podcast-Detail';
import CustomTabBar from './src/screens/CustomTabBar';
import ViewRecordings from './src/screens/ViewRecordings';
import VideoRecording from './src/screens/Video-message';
import PodcastTab from './src/screens/PodcastTab';
import Appinfo from './src/screens/AppInfo';
import Camera from './src/components/camera';

const Stack=createStackNavigator();
const PrimaryNavigation=({navigation})=>{
return(
   <Stack.Navigator initialRouteName="Now Playing">
       <Stack.Screen name="Now Playing" navigation={navigation} component={RadioTabs}
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
        <Stack.Screen name="Podcast" component={Podcast} options={{
            headerStyle: {
                backgroundColor: 'black',
              },
            headerTintColor: '#fff',
        }} />
        <Stack.Screen name="Podcast Detail" component={PodDetail} options={{
            headerRight:()=>(
                <Entypo name="home" size={30} color="white"  onPress={()=>navigation.navigate('Now Playing')} />
                ),
            headerStyle: {
                backgroundColor: 'black',
              },
            headerTintColor: '#fff',
        }}/>
        
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
const TabNavigation=({itemCount})=>{
    
    return(
        <Tab.Navigator 
        initialRouteName="Now Playing"
        tabBarOptions={{
            activeTintColor: 'white',
            inactiveTintColor: '#d9d9d9',
            style:{
                borderTopColor: '#66666666',
                backgroundColor: 'black',
                elevation: 0,
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
                 } else if(route.name === 'Shop'){
                    return iconName=focused
                     ? <FontAwesome5 name="shopping-basket" size={24} color="white" />
                     : <FontAwesome5 name="shopping-basket" size={24} color="white" />
                 }

                 return <Ionicons name={iconName} size={25} color="white" /> 
             }
         })}
        >
             <Tab.Screen name="Now Playing" component={PrimaryNavigation}/>
             <Tab.Screen name="Watch" component={WatchNavigator}/>
             <Tab.Screen name="Podcasts" component={PodcastTab}/>
             <Tab.Screen name="Shop" component={ShopNavigator} options={{ tabBarBadge: itemCount }} />
        </Tab.Navigator>
    )
}
const ShopNavigator=({navigation,itemCount})=>{
    return(
       <Stack.Navigator>
           <Stack.Screen name="Shop" component={Shop}  
              options={{
                headerRight:()=>(
                    <Entypo name="shopping-cart" size={30} color="white"  onPress={()=>navigation.navigate('Cart')} />
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

const NotificationNavigator=({navigation})=>{
    return(
        <Stack.Navigator>
        <Stack.Screen name="Notifications" component={PushNotifications}  
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

const AppInfoNavigation=({navigation})=>{
    return(
        <Stack.Navigator>
            <Stack.Screen name="App info" component={Appinfo}
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
          <Stack.Screen name="Wiggle Tunes Messenger" component={VoiceMessage}  
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
          <Stack.Screen
           name="Camera"
           component={Camera} 
           navigation={navigation} 
           options={{
              headerStyle: {
                backgroundColor: 'black',
              },
            headerTintColor: '#fff',
          }}/>
      </Stack.Navigator>
    )
}

const VideoNavigation=({navigation})=>{
    return(
      <Stack.Navigator>
          <Stack.Screen name="Video Message" component={VideoRecording}  
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
          isSubscribed:true,
          data:[]
        }
    }


 

  async  componentDidMount() {
      console.log('This is the value ',this.props.itemCount)
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
        OneSignal.setNotificationWillShowInForegroundHandler(async notificationReceivedEvent => {
            console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
            let notification = notificationReceivedEvent.getNotification();
            const d=[];
            d.push(notification)
            console.log('This is the notification in an array', d);
          
            console.log("notification: ", notification);
            const data = notification.additionalData;
            console.log("additionalData: ", data);
            const title=d.map(item=>{
                return item.title;
            })
            const body=d.map(item=>{
                return item.body;
            })

            const image=d.map(item=>{
                return item.bigPicture;
            })
            await db.collection("Notifications")
            .add({
              title:title[0],
              body:body[0],
              image:image[0]
            })
        });
        OneSignal.setInAppMessageClickHandler(respons=>{
            console.log("OneSignal IAM clicked:", respons);
            this.onReceived();
        })

        OneSignal.setNotificationOpenedHandler( async (notification) => {
            console.log("OneSignal: notification opened:", notification);
            
             this.onReceived();
            console.log('I am clicked by Sam')
        });

        const deviceState = await OneSignal.getDeviceState();

        this.setState({
            isSubscribed : deviceState.isSubscribed
        });

    }

    
    onReceived() {
        console.log('Navigate')
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
               {/* <Drawer.Screen name="Shop" component={ShopNavigator} options={{
                   drawerIcon:()=>(
                    <AntDesign name="shoppingcart" size={24} color="white" />
                   )

               }}/> */}
               <Drawer.Screen name="Feedback" component={FeedbackNavigation} options={{
                   drawerIcon:()=>(
                    <MaterialIcons name="feedback" size={24} color="white" />
                   )

               }} />
               <Drawer.Screen name="Wiggle Tunes Messenger" component={VoiceNavigation} options={{
                   drawerIcon:()=>(
                    <MaterialIcons name="keyboard-voice" size={24} color="white" />
                   )

               }} />
                 <Drawer.Screen name="Notifications" component={NotificationNavigator} options={{
                   drawerIcon:()=>(
                    <Ionicons name="notifications" size={24} color="white" />
                   )

               }}/>
                {/* <Drawer.Screen name="Live Streaming" component={NotificationNavigator} options={{
                   drawerIcon:()=>(
                    <MaterialIcons name="live-tv" size={24} color="white" />
                   )

               }}/> */}
               <Drawer.Screen name="Rate this App" component={ReviewNavigation} options={{
                   drawerIcon:()=>(
                    <MaterialIcons name="star-rate" size={24} color="white" />
                   )

               }}/>
               <Drawer.Screen name="App Info" component={AppInfoNavigation} options={{
                   drawerIcon:()=>(
                    <AntDesign name="infocirlceo" size={24} color="white" />
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

