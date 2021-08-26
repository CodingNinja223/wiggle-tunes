import React,{Component} from 'react';
import {View,FlatList,TouchableOpacity,ScrollView,Image,SafeAreaView,ActivityIndicator, StyleSheet }from 'react-native';
import {AdMobBanner} from 'expo-ads-admob';
import { Card, CardItem, Left,Right, Body,Text, Icon } from 'native-base';

class News extends Component{
    constructor(){
        super();
        this.state={
          posts:[],
          isLoading:true
        }
    }

    componentDidMount(){
    fetch('https://www.wiggletunes.co.za/wp-json/wp/v2/posts?_embed')
    .then(res=>res.json())
    .then(data=>{
        this.setState({
            posts:[...data],
            isLoading:false
        })
    })
}

    render(){
      const {posts}=this.state;
        console.log(posts);
        if(this.state.isLoading){
          return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#a80404"/>
            </View>
          )
        }
        return(
          <ScrollView style={{backgroundColor:'#161616'}}>
            <FlatList
              keyExtractor={item=> item.id.toString()}
              data={posts}
              renderItem={({item})=>(
              <TouchableOpacity onPress={()=>{
                  this.props.navigation.navigate('Detail',{
                      itemId:item.id,
                      image:item.featured_image_urls.medium,
                      content:item.content.rendered.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ''),
                      headerTitle:item.title.rendered
                  })
              }}>   
               <Card>
                    <CardItem>
                      <Left style={{flex:0.8}}>
                        <Body>
                          <Text note style={{fontWeight:'bold',fontSize:17}}>{item.title.rendered.replace(/&#8217;/g, "'").replace('&amp;','&')}</Text>
                        </Body>
                      </Left>
                      <Right style={{flex:0.2}}>
                        <Icon name="ios-heart"/>
                      </Right>
                    </CardItem>
                    <CardItem cardBody>
                      <Image source={{ uri:item.featured_image_urls.medium }} style={{ width:'100%', height: 170,resizeMode:'cover' }}  />
                    </CardItem>
                    <CardItem content style={{margin:10}}>
                     <Text note numberOfLines={1}>{item.content.rendered.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '').replace(/&#39;/g, "'").replace(/&#8217;/g, "'").replace(/&nbsp;/g, " ").replace(/&#8211;/g, "-").replace(/&gt;/g, ">").replace(/&#8216;/g, "'").replace(/&#8221;/g, ' " ' ).replace(/&#8230;/g, ' ... ' ).replace(/&mdash;/g, ' -- ' ).replace(/&quot;/g, '"').replace(/&#8220;/g, '"')}</Text>
                    </CardItem>
                  </Card>
             </TouchableOpacity>  
             )}
          />
            <AdMobBanner
              bannerSize="fullBanner"
              adUnitID="ca-app-pub-4848737122422413/6221324032" // Test ID, Replace with your-admob-unit-id
              servePersonalizedAds // true or false
              onDidFailToReceiveAdWithError={this.bannerError} />
          </ScrollView>
        )
    }
}
export default News;

const styles=StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'black'
  }
})