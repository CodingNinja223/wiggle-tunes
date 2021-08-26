import React,{Component} from 'react';
import {View,Text,Image,StyleSheet,ScrollView} from 'react-native';
import {AdMobBanner} from 'expo-ads-admob';
class NewsDetail extends Component{
    render(){
    const {image,content } = this.props.route.params;
    return(
        <ScrollView style={{backgroundColor:'#161616'}}>
            <Image
              style={styles.image}
              source={{uri:image}}
            />
            <View style={styles.contentContainer}>
                <Text style={styles.content}>{content.replace(/&#39;/g, "'").replace(/&#8217;/g, "'").replace(/&nbsp;/g, " ").replace(/&#8211;/g, "-").replace(/&gt;/g, ">").replace(/&#8216;/g, "'").replace(/&#8221;/g, ' " ' ).replace(/&#8230;/g, ' ... ' ).replace(/&mdash;/g, ' -- ' ).replace(/&quot;/g, '"').replace(/&#8220;/g, '"')}</Text>
                <AdMobBanner
                bannerSize="fullBanner"
                adUnitID="ca-app-pub-4848737122422413/6221324032" // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds // true or false
                onDidFailToReceiveAdWithError={this.bannerError} />
            </View>
    </ScrollView>
    )
}
}

const styles=StyleSheet.create({
    image:{
    
     
        height:300,
        width:'100%'
    },

    content:{
        marginTop:20,
       color:'white',
        lineHeight:20
    },
    contentContainer:{
        margin:20
    }
})



export default NewsDetail;