import { registerRootComponent } from 'expo';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import store from './redux/store';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);

const RNREDUX=()=>(
    <Provider store={store}>
        <App/>
    </Provider>
)

AppRegistry.registerComponent('wiggletunes',()=>RNREDUX)

