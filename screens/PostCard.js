import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from 'firebase';

let customFonts = {
  "Josefin-Sans": require("../assets/JosefinSans-SemiBold.ttf")
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme : true,
      post_id : this.props.post.key,
      post_data : this.props.post.value
    };
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

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <TouchableOpacity style={styles.container} onPress = {()=>this.props.navigation.navigate('PostScreen', {post : this.props.post})}>
          <View style={this.state.light_theme ? styles.cardContainer_light : styles.cardContainer}>
            <Image
              source={require("../assets/post.jpeg")}
              style={styles.storyImage}
            ></Image>

            <View style={styles.titleContainer}>
              <Text style={this.state.light_theme ? styles.storyTitleText_light : styles.storyTitleText}>
                {this.props.post.caption}
              </Text>
              <View style={styles.authorContainer}>
              <Image source={require("../assets/profile_img.png")} style={styles.profileImage}></Image>
              <Text style={this.state.light_theme ? styles.storyAuthorText_light : styles.storyAuthorText}>
                {this.props.post.author}
              </Text>
              </View>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.likeButton}>
                <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                <Text style={styles.likeText}>12k</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#3F6447",
    borderRadius: RFValue(20)
  },
  cardContainer_light: {
    margin: RFValue(13),
    backgroundColor: "#D7FDBA",
    borderRadius: RFValue(20)
  },
  storyImage: {
    resizeMode: "contain",
    width: "75%",
    alignSelf: "center",
    height: RFValue(230)
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  storyTitleText: {
    fontSize: RFValue(30),
    fontFamily: "Josefin-Sans",
    color: "white"
  },
  storyTitleText_light: {
    fontSize: RFValue(30),
    fontFamily: "Josefin-Sans",
    color: "#0B0A09"
  },
  storyAuthorText: {
    fontSize: RFValue(25),
    fontFamily: "Josefin-Sans",
    color: "white",
    justifyContent : 'center'
  },
  storyAuthorText_light: {
    fontSize: RFValue(25),
    fontFamily: "Josefin-Sans",
    color: "#0B0A09",
    justifyContent : 'center'
  },
  authorContainer : {
    flexDirection : 'row'
  },
  descriptionText: {
    fontFamily: "Josefin-Sans",
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10)
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  profileImage : {
    resizeMode: "contain",
    width: "25%",
    borderRadius : 100,
    alignSelf: "center",
    height: RFValue(75),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#171635",
    borderRadius: RFValue(30)
  },
  likeText: {
    color: "white",
    fontFamily: "Josefin-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  }
});