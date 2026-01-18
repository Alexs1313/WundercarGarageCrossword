import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { garageHtmlLoader } from '../constants/garageHtmlLoader';

const WundercarLoader = () => {
  const nav = useNavigation();

  const [showLoader, setShowLoader] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
      setShowImage(true);
    }, 4000);

    const navTimer = setTimeout(() => {
      try {
        nav.replace('WundercarOnboard');
      } catch (err) {
        console.warn('replace failed', err);
        nav.navigate('WundercarOnboard');
      }
    }, 6500);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(navTimer);
    };
  }, [nav]);

  return (
    <ImageBackground
      source={require('../assets/images/homeBackground.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {showImage && (
          <View style={sty.logoWrapper} accessibilityLabel="loader-screen">
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 300, height: 300, borderRadius: 62 }}
            />
          </View>
        )}

        {showLoader && (
          <View style={sty.webviewWrapper}>
            <WebView
              originWhitelist={['*']}
              source={{ html: garageHtmlLoader }}
              style={sty.webview}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const sty = StyleSheet.create({
  logoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 650,
  },
  webviewWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  webview: {
    width: 360,
    height: 110,
    backgroundColor: 'transparent',
  },
});

export default WundercarLoader;
