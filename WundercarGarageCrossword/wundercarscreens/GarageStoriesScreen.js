import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
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

const wundercartFont = 'impact';
const backImg = require('../assets/images/back.png');
const gradientColors = ['#FEE08E', '#FEAE06'];

const garageStories = [
  {
    id: 1,
    title: 'The Bolt That Taught Me Patience',
    text: 'Once I rushed and stripped the thread on an old engine. Tried to be fast — ended up doing it twice. Lesson learned: slow is faster than fixing mistakes later.',
  },
  {
    id: 2,
    title: 'The Most Expensive Repair Was Free',
    text: 'A guy came in with no money. It was a small issue, fixed it in five minutes. Later he brought three friends. Reputation costs more than cash.',
  },
  {
    id: 3,
    title: 'Listen to the Engine, Not the Client',
    text: 'Client said, “It knocks on the left.” I listened — it was on the right. Cars don’t lie. People sometimes do.',
  },
  {
    id: 4,
    title: 'Old Cars Have a Soul',
    text: 'New cars are computers on wheels. Old ones… they tell stories. Every sound, every smell, every vibration means something.',
  },
  {
    id: 5,
    title: 'The Mistake That Made Me a Master',
    text: 'Once I forgot to tighten a bolt. The car came back the next day. I felt ashamed. Since then, I double-check everything. Sleep better too.',
  },
  {
    id: 6,
    title: 'Tools Are an Extension of Your Hands',
    text: 'A cheap wrench can ruin a thread. A good one saves your nerves. Never save money on what you work with.',
  },
  {
    id: 7,
    title: 'The Garage Clears Your Mind',
    text: 'Here you don’t think about problems. There’s a nut, a wrench, a task. Simple math. You turn it — and it gets easier.',
  },
];

const GarageStoriesScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const isPortraitMode = width < height;

  const [storyIndex, setStoryIndex] = useState(0);
  const [savedStories, setSavedStories] = useState([]);

  const currentStory = garageStories[storyIndex];
  const isSaved = savedStories.includes(currentStory.id);

  useEffect(() => {
    loadSavedStories();
  }, []);

  const loadSavedStories = async () => {
    try {
      const savedData = await AsyncStorage.getItem('SAVED_STORIES');

      if (savedData) {
        const parsedJSON = JSON.parse(savedData);
        setSavedStories(parsedJSON);
      }
    } catch (error) {
      console.log('load err', error);
    }
  };

  const onNext = () => {
    setStoryIndex(currentIndex => {
      if (currentIndex < garageStories.length - 1) {
        return currentIndex + 1;
      } else {
        return 0;
      }
    });
  };

  const saveStory = async () => {
    try {
      let updatedStories;

      if (isSaved) {
        updatedStories = savedStories.filter(id => id !== currentStory.id);
      } else {
        updatedStories = [...savedStories, currentStory.id];
      }

      setSavedStories(updatedStories);

      await AsyncStorage.setItem(
        'SAVED_STORIES',
        JSON.stringify(updatedStories),
      );
    } catch (error) {
      console.log('saved error', error);
    }
  };

  const handleShareStory = async () => {
    try {
      const shareMessage = `${currentStory.title}\n\n${currentStory.text}`;

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.log('err', error);
    }
  };

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
            colors={gradientColors}
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
            <Text style={styles.wundercarHeadTub}>Garage Stories</Text>
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
              <TouchableOpacity activeOpacity={0.6} onPress={handleShareStory}>
                <Image source={require('../assets/images/share_button.png')} />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6} onPress={onNext}>
                <Image source={require('../assets/images/next_button.png')} />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6} onPress={saveStory}>
                <Image
                  source={
                    isSaved
                      ? require('../assets/images/saved_button.png')
                      : require('../assets/images/save_button.png')
                  }
                />
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
    color: '#3C1C0F',
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
  },
  storyTitle: {
    fontSize: isSmallPhone ? 14 : 16,
    marginBottom: 10,
    color: '#3C1C0F',
    textAlign: 'center',
    fontWeight: '700',
  },
  storySubTTL: {
    fontSize: isSmallPhone ? 12 : 14,
    lineHeight: 22,
    color: '#3C1C0F',
  },
});

export default GarageStoriesScreen;
