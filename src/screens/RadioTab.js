import React from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Radio from './Radio';
import History from './SongHistory';
import SongRequest from './Songrequest';
const RadioTab=({navigation})=>{
    return(
      <ScrollableTabView tabBarBackgroundColor="black" tabBarUnderlineStyle={{backgroundColor:'red'}} tabBarTextStyle={{fontFamily: 'Roboto', fontSize: 15,color:'white'}}>
          <Radio tabLabel="Now Playing" navigation={navigation}/>
          <History tabLabel="Song History"/>
          <SongRequest tabLabel="Request Song"/>
      </ScrollableTabView>
    )
}
export default RadioTab;