import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native-gesture-handler';
import PostCard from './PostCard';
import firebase from 'firebase';

let customFonts = {
  'BebasNeue' : require('../assets/JosefinSans-SemiBold.ttf'),
};
let posts = require('../temp.json');
export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme : true,
      posts : []
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
    this.setState({
      fontsLoaded: true,
    });
  }

  fetchPosts = () => {
    firebase
        .database()
        .ref("/posts/")
        .on(
          "value",
          snapshot => {
            let posts = [];
            if (snapshot.val()) {
              Object.keys(snapshot.val()).forEach(function (key) {
                posts.push({
                  key: key,
                  value: snapshot.val()[key]
                });
              });
            }
            this.setState({ posts : posts });
            this.props.setUpdateToFalse();
          },
          function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          }
        );
  }
  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchPosts();
  }
  renderItem = ({ item: post }) => {
    return <PostCard post={post} navigation={this.props.navigation}/>;
  };
  keyExtractor = (item, index) => index.toString();
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.light_theme ? styles.container_light : styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.light_theme ? styles.appTitleText_light : styles.appTitleText}>Spectagram</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={posts}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#652A2F',
  },
  container_light: {
    flex: 1,
    backgroundColor: '#FFC2F0',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'BebasNeue',
  },
  appTitleText_light: {
    color: '#0B0A09',
    fontSize: RFValue(28),
    fontFamily: 'BebasNeue',
  },
  cardContainer: {
    flex: 0.93,
  },
});
