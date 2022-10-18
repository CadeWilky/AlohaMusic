import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import ukulelePng from './images/ukulele.png';
import drumsPng from './images/drums.png';

const ukuleleSong = require('./music/ukulele.mp3');
const drumSong = require('./music/drums.mp3');

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);


export default class App extends Component {
  state = {
    ukulelePlaying: false,
    ukuleleInstance: null,
    volume: 1.0,
    drumsPlaying: false,
    drumsInstance: null,
  }

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      InterruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadUkeleleAudio();
    this.loadDrumsAudio();
  }

  ukulelePlayPause = async () => {
    let { ukulelePlaying, ukuleleInstance, drumsPlaying, drumsInstance} = this.state;
    ukulelePlaying ? await ukuleleInstance.pauseAsync() : await ukuleleInstance.playAsync(), await drumsInstance.pauseAsync();
    
    if (drumsPlaying && drumsInstance) {
      drumsInstance.pauseAsync();
      drumsPlaying = false;
    } 
    this.setState({
      ukulelePlaying: !ukulelePlaying,
      drumsPlaying
    });

  }

  drumsPlayPause = async () => {
    let { drumsPlaying, drumsInstance, ukulelePlaying, ukuleleInstance} = this.state;
    drumsPlaying ? await drumsInstance.pauseAsync() : await drumsInstance.playAsync(), await ukuleleInstance.pauseAsync();
    if (ukulelePlaying && ukuleleInstance) {
      ukuleleInstance.pauseAsync();
      ukulelePlaying = false;
    }
    this.setState({
      drumsPlaying: !drumsPlaying,
      ukulelePlaying,
    });

  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }
  async loadUkeleleAudio() {
    const ukuleleInstance = new Audio.Sound();
    const source = require('./music/ukulele.mp3');
    const status = {
      shouldPlay: this.state.ukulelePlaying,
      volume: this.state.volume,
    };
    ukuleleInstance
    .setOnPlaybackStatusUpdate(
      this.onPlaybackStatusUpdate
    );
    await ukuleleInstance.loadAsync(source, status, false);
    this.setState({
      ukuleleInstance
    });
    
  }

  async loadDrumsAudio() {
    const drumsInstance = new Audio.Sound();
    const source = require('./music/drums.mp3');
    const status = {
      shouldPlay: this.state.drumsPlaying,
      volume: this.state.volume,
    };
    drumsInstance
    .setOnPlaybackStatusUpdate(
      this.onPlaybackStatusUpdate
    );
    await drumsInstance.loadAsync(source, status, false);
    this.setState({
      drumsInstance: drumsInstance
    });
    
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>Aloha Music</Text>
        <Image source={ukulelePng} style={styles.photos} />
        <TouchableOpacity style={styles.control} onPress={this.ukulelePlayPause} >
          {this.state.ukulelePlaying ?
          <Feather name="pause" size={32} color="000000"/> :
          <Feather name="play" size={32} color="000000"/> 
          }
        </TouchableOpacity>
        <Image source={drumsPng} style={styles.photos} />
        <TouchableOpacity style={styles.control} onPress={this.drumsPlayPause} >
          {this.state.drumsPlaying ?
          <Feather name="pause" size={32} color="000000"/> :
          <Feather name="play" size={32} color="000000"/> 
          }
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: '#da9547',
    textAlign: 'center',
    width: 350,
    fontSize: 30,
    margin: 30,
    fontWeight: 'bold',
  },
  photos: {
    width: 350,
    height: 210,
  },
  control: {
    margin: 20,
  }
});

// <StatusBar style="auto" />
