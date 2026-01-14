import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { isSmallPhone } from '../constants/useScreen';
import { useStore } from '../wundercaststore/garageContext';

const wundercartFont = 'impact';
const primaryTextColor = '#431C0D';

const backImg = require('../assets/images/homeBackground.png');

const GarageHome = () => {
  const { width, height } = useWindowDimensions();
  const { bolts, loadBolts } = useStore();
  const navigation = useNavigation();
  const isPortraitMode = width < height;

  useFocusEffect(
    useCallback(() => {
      loadBolts();
    }, []),
  );

  return (
    <ImageBackground source={backImg} style={{ flex: 1 }}>
      <TouchableOpacity activeOpacity={0.7}>
        <ImageBackground
          style={[
            styles.wundercarQCont,
            { top: height * 0.05, right: isPortraitMode ? 30 : 20 },
          ]}
          source={require('../assets/images/qFrame.png')}
        >
          <Text style={styles.wundercarQText}>{bolts}</Text>
          <Image source={require('../assets/images/homeQ.png')} />
        </ImageBackground>
      </TouchableOpacity>
      <ScrollView
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Image source={require('../assets/images/homeLgg.png')} />
          <View style={{ rowGap: 15 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('WundercarLevels')}
            >
              <Image source={require('../assets/images/crosswBtn.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('RepairGarageScreen')}
            >
              <Image source={require('../assets/images/garrageB.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('GarageStoriesScreen')}
            >
              <Image source={require('../assets/images/storBtn.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SavedGarageStories')}
            >
              <Image source={require('../assets/images/svdStor.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wundercarSub: {
    color: '#000',
    fontSize: isSmallPhone ? 16 : 18,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontWeight: '500',
    lineHeight: 24,
  },
  wundercarBut: {
    marginTop: 30,
    width: 77,
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wundercarSkipBut: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  wundercarSkipText: {
    color: primaryTextColor,
    fontSize: 16,
    fontFamily: wundercartFont,
  },
  wundercarButText: {
    color: primaryTextColor,
    fontSize: 16,
    fontFamily: wundercartFont,
  },
  wundercarQCont: {
    width: 77,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 5,
    position: 'absolute',
    top: 50,
    right: 30,
  },
  wundercarQText: {
    color: primaryTextColor,
    fontSize: 16,
    fontFamily: wundercartFont,
  },
});

export default GarageHome;
