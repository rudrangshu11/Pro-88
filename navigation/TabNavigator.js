import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import Feed from '../screens/Feed';
import CreatePost from '../screens/CreatePost';
import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { RFValue } from "react-native-responsive-fontsize";
import firebase from 'firebase';

const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends React.Component{
  constructor(props){
    super(props);
    this.state={
      light_theme : true
    }
  }
  async fetchUser(){
    let theme;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function(snapshot) {
        theme = snapshot.val().current_theme;
      })
    this.setState({
      light_theme: theme === "light" ? true : false,
    });
  }
  componentDidMount(){
    this.fetchUser();
  }
  render(){
  return (
    <Tab.Navigator
      labeled = {false}
      barStyle={this.state.light_theme ? styles.bottomTabStyle_light : styles.bottomTabStyle}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if (route.name === 'Feed') {
            iconName = focused ? 'book' : 'book-outline';
          } else if(route.name === "CreatePost"){
            iconName = focused ? 'create' : 'create-outline';
          }
            return <Ionicons name = {iconName} size={RFValue(30)} color = {color} style={styles.icons}/>
        }
      })}
      tabBarOptions = {{
        activeTintColor : '#b7bb9a',
        inactiveTintColor : '#916d4d'
      }}
      >
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="CreatePost" component={CreatePost} />
    </Tab.Navigator>
  );
}
}


const styles = StyleSheet.create({
    bottomTabStyle: {
        backgroundColor: "#34261E",
        height: "10%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
        position: "absolute"
    },
    bottomTabStyle_light: {
        backgroundColor: "#B6D0F7",
        height: "10%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
        position: "absolute"
    },
     icons: {
        width: RFValue(30),
        height: RFValue(30),
   }
})

