import * as React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation'

import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/Dashboard'

import {firebaseConfig} from './config';
import firebase from 'firebase';

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  }
  else{
      firebase.app();
  }

  const AppSwitchNavigator = createSwitchNavigator({
    LoadingScreen : LoadingScreen,
    LoginScreen : LoginScreen,
    DashboardScreen : DashboardScreen
  })

const AppNavigator = createAppContainer(AppSwitchNavigator)
export default function App() {
  return(
    <AppNavigator/>
  )
}


