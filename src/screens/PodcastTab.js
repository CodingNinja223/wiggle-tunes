import React from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Podcast from '../screens/Podcast';
import Interviews from './Interviews';
import Episodes from './Episdoes';


const PodcastTab=({navigation})=>{
    return(
        <ScrollableTabView tabBarBackgroundColor="black"  tabBarUnderlineStyle={{backgroundColor:'red'}} tabBarTextStyle={{fontFamily: 'Roboto', fontSize: 15,color:'white'}}>
            <Podcast tabLabel="Podcast" navigation={navigation} />
            <Interviews tabLabel="Interviews"/>
            <Episodes tabLabel="Episodes"/>
        </ScrollableTabView>
    )
}

export default PodcastTab;