import React, { useEffect, useMemo, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { garageCrosswords } from '../crossworddata/garageCrossword';

const backImg = require('../assets/images/garrage_back.png');
const openedLevel = require('../assets/images/opened_level.png');
const lockedLevel = require('../assets/images/closed_level.png');
const currentLevel = require('../assets/images/current_level.png');

export default function WundercarLevels({ navigation }) {
  const [completedIds, setCompletedIds] = useState(new Set());
  const { height } = useWindowDimensions();

  useEffect(() => {
    const loadCompletedCrosswords = async () => {
      const rawData = await AsyncStorage.getItem('CROSSWORD_DONE');

      const completedArray = rawData ? JSON.parse(rawData) : [];

      console.log('loaded!');
      setCompletedIds(new Set(completedArray));
    };

    loadCompletedCrosswords();
  }, []);

  const levels = useMemo(() => garageCrosswords, []);

  const currentLevelId = useMemo(() => {
    for (const level of levels) {
      if (!completedIds.has(level.id)) {
        return level.id;
      }
    }

    return levels[levels.length - 1].id;
  }, [completedIds, levels]);

  const openLevel = levelId => {
    navigation.navigate('CrosswordScreen', { levelId });
  };

  const getLevelState = levelId => {
    if (completedIds.has(levelId)) {
      return 'done';
    }

    if (levelId === currentLevelId) {
      return 'current';
    }

    console.log('isLocked');
    return 'locked';
  };

  return (
    <ImageBackground source={backImg} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ paddingTop: height * 0.07 }}>
          <LinearGradient colors={['#FEE08E', '#FEAE06']} style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../assets/images/foundation_arrow-up.png')}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Crossword Puzzles</Text>
          </LinearGradient>

          <View style={[styles.grid, { marginTop: height * 0.115 }]}>
            {levels.map(lvl => {
              const state = getLevelState(lvl.id);
              const isActive = state !== 'locked';

              return (
                <TouchableOpacity
                  key={lvl.id}
                  activeOpacity={isActive ? 0.85 : 1}
                  disabled={!isActive}
                  style={[
                    styles.levelBtn,
                    state === 'done' && styles.levelDone,
                    state === 'current' && styles.levelCurrent,
                    state === 'locked' && styles.levelLocked,
                  ]}
                  onPress={() => openLevel(lvl.id)}
                >
                  <ImageBackground
                    source={
                      state === 'done'
                        ? openedLevel
                        : state === 'current'
                        ? currentLevel
                        : lockedLevel
                    }
                    style={{
                      width: 86,
                      height: 84,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={styles.levelText}>{lvl.id}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginTop: height * 0.11 }}
            onPress={() => openLevel(currentLevelId)}
          >
            <ImageBackground
              source={require('../assets/images/start_Button.png')}
              style={styles.startBtn}
            >
              <Text style={styles.startText}>Start Level {currentLevelId}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '78%',
    height: 52,
    borderRadius: 22,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', left: 12 },
  headerText: { color: '#3C1C0F', fontSize: 22, fontWeight: '900' },
  grid: {
    alignSelf: 'center',
    width: '70%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 18,
  },
  levelBtn: {
    width: 84,
    height: 84,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 40,
    color: '#3C1C0F',
    fontFamily: 'impact',
  },
  startBtn: {
    width: 180,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  startText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#431C0D',
    fontFamily: 'impact',
  },
});
