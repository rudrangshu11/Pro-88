import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';

let customFonts = {
  BebasNeue: require('../assets/JosefinSans-SemiBold.ttf'),
};

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: 'image_1',
      dropDownHeight: 40,
      light_theme: true,
    };
  }
  async addPost() { 
    if(this.state.caption){
      let postData = {
        preview_image : this.state.previewImage,
        caption : this.state.caption,
        author : firebase.auth().currentUser.displayName,
        created_on : new Date(),
        author_uid : firebase.auth().currentUser.uid,
        likes : 0
      }
      await firebase
      .database()
      .ref("/posts/" + (Math.random().toString(36).slice(2)))
      .set(postData)
      .then(function(snapshot){

      })
      this.props.navigation.navigate("Feed")
    } else{
      Alert.alert(
        'Error',
        'All fields are required',
        [
          {text : 'OK', onPress : () => console.log('Ok Pressed')}
        ],
        {cancelable : false}
      )
    }
  }
  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
      });
    this.setState({
      light_theme: theme === 'light' ? true : false,
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
      let preview_images = {
        image_1: require('../assets/image_7.jpg'),
        image_2: require('../assets/image_2.jpg'),
        image_3: require('../assets/image_3.jpg'),
        image_4: require('../assets/image_4.jpg'),
        image_5: require('../assets/image_5.jpg'),
        image_6: require('../assets/image_6.jpg'),
        image_7: require('../assets/image_1.jpg'),
      };
      return (
        <View
          style={
            this.state.light_theme ? styles.container_light : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleText_light
                    : styles.appTitleText
                }>
                New Post
              </Text>
            </View>
          </View>
          <View style={styles.fieldsConatainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}></Image>
              <View style={{ height: RFValue(this.state.dropDownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: 'Image 1', value: 'image_1' },
                    { label: 'Image 2', value: 'image_2' },
                    { label: 'Image 3', value: 'image_3' },
                    { label: 'Image 4', value: 'image_4' },
                    { label: 'Image 5', value: 'image_5' },
                    { label: 'Image 6', value: 'image_6' },
                    { label: 'Image 7', value: 'image_7' },
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                    height: 40,
                    borderRadius: 20,
                    marginBottom: 10,
                  }}
                  onOpen={() => {
                    this.setState({
                      dropDownHeight: 170,
                    });
                  }}
                  onClose={() => {
                    this.setState({
                      dropDownHeight: 40,
                    });
                  }}
                  style={{ backgroundColor: 'transparent' }}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  dropDownStyle={{ backgroundColor: '#132524' }}
                  labelStyle={{ color: 'gray', fontFamily: 'Josefin-Sans' }}
                  arrowStyle={{ color: 'white', fontFamily: 'Josefin-Sans' }}
                  onChangeItem={(item) =>
                    this.setState({
                      previewImage: item.value,
                    })
                  }
                />
              </View>
              <TextInput
                style={[
                  this.state.light_theme
                    ? styles.inputFont_light
                    : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(caption) => this.setState({ caption })}
                placeholder={'Caption'}
                multiline={true}
                numberOfLines={6}
                placeholderTextColor="gray"
              />
              <View style={styles.submitButton}>
                <TouchableOpacity style={this.state.light_theme? styles.submit_light : styles.submit} onPress={() => this.addPost()}>
                  <Text style = {this.state.light_theme ? styles.submitText_light : styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          <View style={{ flex: 0.08 }} />
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
    backgroundColor: '#E0FBDA',
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
  fieldsConatainer: {
    flex: 0.85,
  },
  previewImage: {
    width: '93%',
    height: RFValue(250),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: 'white',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'white',
    fontFamily: 'Josefin-Sans',
  },
  inputFont_light: {
    height: RFValue(40),
    borderColor: '#0B0A09',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: '#0B0A09',
    fontFamily: 'Josefin-Sans',
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  submitButton : {
    marginTop : RFValue(20),
    alignItems : 'center',
    justifyContent : 'center'
  },
  submit:{
    backgroundColor : '#1d2e28',
    padding : 20,
    paddingHorizontal : 20,
    margin : 20,
    borderRadius : 30
  },
  submit_light : {
    backgroundColor : '#01d669',
    padding : 20,
    paddingHorizontal : 20,
    margin : 20,
    borderRadius : 30
  },
  submitText : {
    color : 'white',
    fontFamily : 'Josefin-Sans'
  },
  submitText_light : {
    color : 'black',
    fontFamily : 'Josefin-Sans'
  }
});
