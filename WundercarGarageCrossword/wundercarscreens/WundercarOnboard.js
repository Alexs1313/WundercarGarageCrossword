import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import { isSmallPhone } from '../constants/useScreen';

const wundercartFont = 'impact';
const primaryTextColor = '#431C0D';
const gradientColors = ['#8DE1DC', '#45B5F7'];

const onboardImgs = [
  require('../assets/images/wunderboard1.png'),
  require('../assets/images/wunderboard2.png'),
  require('../assets/images/wunderboard3.png'),
  require('../assets/images/wunderboard4.png'),
];

const onboardTexts = [
  {
    ttlImg: require('../assets/images/title1.png'),
    sbttl: 'Solve puzzles. Restore machines. Give old rides a second life.',
    btnText: 'GO!',
  },
  {
    ttlImg: require('../assets/images/title1.png'),
    sbttl:
      'Solve crosswords and earn garage nuts. Every puzzle helps you move forward.',
    btnText: 'NEXT',
  },
  {
    ttlImg: require('../assets/images/title1.png'),
    sbttl: `Exchange garage nuts to restore vehicles. Sometimes fixing
is better than throwing away.`,
    btnText: 'NEXT',
  },
  {
    ttlImg: require('../assets/images/title1.png'),
    sbttl: `Listen to garage stories from the master. Short thoughts about work, 
patience, and care.`,
    btnText: 'GO!',
  },
];

const WundercarOnboard = () => {
  const { width, height } = useWindowDimensions();
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const navigation = useNavigation();
  const isPortraitMode = width < height;

  const nextStep = () => {
    if (onboardingIndex < onboardImgs.length - 1) {
      setOnboardingIndex(onboardingIndex + 1);
    } else {
      navigation.replace('GarageHome');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            source={onboardImgs[onboardingIndex]}
            style={{
              width: '100%',
              aspectRatio: isPortraitMode ? 12 / 16 : 15 / 10,
              resizeMode: 'cover',
            }}
          />

          <LinearGradient
            colors={gradientColors}
            style={{
              width: '100%',
              borderRadius: 60,
              marginTop: -80,
              height: '100%',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                paddingVertical: 40,
                alignItems: 'center',
              }}
            >
              <Image source={require('../assets/images/title1.png')} />
              <Text style={styles.wundercarSub}>
                <Text style={(styles.wundercarSub, { fontWeight: '700' })}>
                  {onboardingIndex === 0 && 'Garage Word Quest\n'}
                </Text>
                {onboardTexts[onboardingIndex].sbttl}
              </Text>

              <TouchableOpacity onPress={nextStep} activeOpacity={0.7}>
                <ImageBackground
                  style={styles.wundercarBut}
                  source={require('../assets/images/onBBut.png')}
                >
                  <Text style={styles.wundercarButText}>
                    {onboardTexts[onboardingIndex].btnText}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.wundercarSkipBut}
                onPress={() => navigation.replace('GarageHome')}
              >
                <Text style={styles.wundercarSkipText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
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
});

export default WundercarOnboard;
