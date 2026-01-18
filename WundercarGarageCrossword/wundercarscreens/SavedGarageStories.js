import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { isSmallPhone } from '../constants/useScreen';
import { garageStories } from '../crossworddata/garageStories';

const wundercartFont = 'impact';
const backImg = require('../assets/images/back.png');
const primaryColor = '#3C1C0F';

const SavedStoriesScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const isPortraitMode = width < height;

  const [savedList, setSavedList] = useState([]);
  const [index, setIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadSavedStories();
    }, []),
  );

  const loadSavedStories = async () => {
    try {
      const savedData = await AsyncStorage.getItem('SAVED_STORIES');

      if (!savedData) {
        setSavedList([]);
        return;
      }

      const savedIds = JSON.parse(savedData);
      const relevantStories = garageStories.filter(story =>
        savedIds.includes(story.id),
      );

      setSavedList(relevantStories);
      setIndex(0);
    } catch (error) {
      console.error('Error loading', error);
    }
  };

  const onNext = () => {
    setIndex(prev => (prev < savedList.length - 1 ? prev + 1 : 0));
  };

  const onRemove = async () => {
    try {
      const updated = savedList.filter(
        story => story.id !== savedList[index].id,
      );

      const updatedIds = updated.map(item => item.id);

      await AsyncStorage.setItem('SAVED_STORIES', JSON.stringify(updatedIds));

      setSavedList(updated);

      setIndex(0);
    } catch (e) {
      console.log('remove error', e);
    }
  };

  const onShare = async () => {
    try {
      const currentItem = savedList[index];
      const shareMessage = `${currentItem.title}\n\n${currentItem.text}`;

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error('Error sharing!', error);
    }
  };

  if (savedList.length === 0) {
    return (
      <ImageBackground source={backImg} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: height * 0.08,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <LinearGradient
              colors={['#FEE08E', '#FEAE06']}
              style={{
                width: width * 0.75,
                height: 50,
                borderRadius: 20,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ position: 'absolute', left: 10 }}
                onPress={() => navigation.goBack()}
              >
                <Image
                  source={require('../assets/images/foundation_arrow-up.png')}
                />
              </TouchableOpacity>

              <Text style={styles.wundercarHeadTub}>Saved Stories</Text>
            </LinearGradient>
          </View>

          <View style={styles.emptyStateContainer}>
            <Image
              source={require('../assets/images/empt_txt.png')}
              style={{ marginBottom: 30 }}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('GarageStoriesScreen')}
            >
              <Image source={require('../assets/images/storBtn.png')} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  const currentStory = savedList[index];

  return (
    <ImageBackground source={backImg} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: height * 0.08,
          height: isPortraitMode ? height : width,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <LinearGradient
            colors={['#FEE08E', '#FEAE06']}
            style={{
              width: width * 0.75,
              height: 50,
              borderRadius: 20,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ position: 'absolute', left: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../assets/images/foundation_arrow-up.png')}
              />
            </TouchableOpacity>

            <Text style={styles.wundercarHeadTub}>Saved Stories</Text>
          </LinearGradient>
        </View>

        <View
          style={{
            alignItems: 'center',
            paddingTop: height * 0.1,
            flex: 1,
          }}
        >
          <View style={styles.storyContainer}>
            <Text style={styles.storyTitle}>{currentStory.title}</Text>

            <Text style={styles.storySubTTL}>{currentStory.text}</Text>

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <TouchableOpacity onPress={onShare}>
                <Image source={require('../assets/images/share_button.png')} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onNext}>
                <Image source={require('../assets/images/next_button.png')} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onRemove}>
                <Image source={require('../assets/images/saved_button.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wundercarHeadTub: {
    color: primaryColor,
    fontSize: isSmallPhone ? 20 : 24,
    fontFamily: wundercartFont,
  },
  storyContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FEFAEA',
    borderRadius: 16,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#935F17',
    width: '90%',
    alignSelf: 'center',
    minHeight: 200,
  },
  storyTitle: {
    fontSize: isSmallPhone ? 14 : 16,
    marginBottom: 10,
    color: primaryColor,
    textAlign: 'center',
    fontWeight: '700',
  },
  storySubTTL: {
    fontSize: isSmallPhone ? 12 : 14,
    lineHeight: 22,
    color: primaryColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: primaryColor,
    marginBottom: 10,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTextT: {
    color: '#000',
    fontSize: isSmallPhone ? 16 : 18,
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default SavedStoriesScreen;
