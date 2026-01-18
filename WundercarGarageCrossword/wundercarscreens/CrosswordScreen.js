import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Share,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  buildGrid,
  cloneMatrixWithSet,
  getWordPath,
  isSolved,
  resolveActiveWord,
} from '../utils/crosswordGrid';
import { garageCrosswords } from '../crossworddata/garageCrossword';

const backImg = require('../assets/images/garrage_back.png');
const resultBg = require('../assets/images/result_back.png');
const wundercartFont = 'impact';
const primaryTextColor = '#3C1C0F';
const gradientColors = ['#FEE08E', '#FEAE06'];
const questionGradientColors = ['#8DE1DC', '#45B5F7'];

export default function CrosswordScreen({ navigation, route }) {
  const { levelId } = route.params;

  const level = useMemo(
    () => garageCrosswords.find(l => l.id === levelId),
    [levelId],
  );
  const { matrix: initialMatrix, bounds } = useMemo(
    () => buildGrid(level),
    [level],
  );

  const [matrix, setMatrix] = useState(initialMatrix);
  const [movesLeft, setMovesLeft] = useState(level.moves ?? 30);
  const { height } = useWindowDimensions();
  const [selected, setSelected] = useState({ rr: 0, cc: 0 });
  const [preferredDir, setPreferredDir] = useState('across');
  const [activeWordNumber, setActiveWordNumber] = useState(null);

  const [showWin, setShowWin] = useState(false);
  const [showLose, setShowLose] = useState(false);

  const hiddenInputRef = useRef(null);

  useEffect(() => {
    outer: for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[0].length; c++) {
        if (matrix[r][c]) {
          setSelected({ rr: r, cc: c });
          const n = resolveActiveWord(level, bounds, r, c, preferredDir);
          setActiveWordNumber(n);
          break outer;
        }
      }
    }
  }, []);

  const activePath = useMemo(() => {
    if (!activeWordNumber) return [];
    return getWordPath(level, bounds, activeWordNumber);
  }, [activeWordNumber, level, bounds]);

  const focusKeyboard = () => {
    hiddenInputRef.current?.focus();
  };

  const pickCell = (rr, cc) => {
    if (!matrix[rr][cc]) return;

    if (selected.rr === rr && selected.cc === cc) {
      const nextDir = preferredDir === 'across' ? 'down' : 'across';
      setPreferredDir(nextDir);
      const n = resolveActiveWord(level, bounds, rr, cc, nextDir);
      setActiveWordNumber(n);
    } else {
      setSelected({ rr, cc });
      const n = resolveActiveWord(level, bounds, rr, cc, preferredDir);
      setActiveWordNumber(n);
    }

    focusKeyboard();
  };

  const goNextInWord = (rr, cc) => {
    if (!activePath.length) return { rr, cc };
    const idx = activePath.findIndex(([r, c]) => r === rr && c === cc);
    if (idx < 0) return { rr, cc };
    const next = activePath[idx + 1] || activePath[0];
    return { rr: next[0], cc: next[1] };
  };

  const applyLetter = chRaw => {
    if (showWin || showLose) return;
    if (movesLeft <= 0) return;

    const ch = (chRaw || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!ch) return;

    const { rr, cc } = selected;
    if (!matrix[rr][cc]) return;

    const nextMatrix = cloneMatrixWithSet(matrix, rr, cc, ch);
    const nextMoves = movesLeft - 1;

    setMatrix(nextMatrix);
    setMovesLeft(nextMoves);

    const nextSel = goNextInWord(rr, cc);
    setSelected(nextSel);

    if (isSolved(nextMatrix)) {
      onWin();
      return;
    }
    if (nextMoves <= 0) {
      setShowLose(true);
      return;
    }
  };

  const addBolts = async amount => {
    const savedBolts = await AsyncStorage.getItem('earned_nuts');
    const currentBolts = savedBolts ? Number(savedBolts) : 0;

    const updatedBolts = currentBolts + amount;

    await AsyncStorage.setItem('earned_nuts', String(updatedBolts));
    console.log('svd');
  };

  const onWin = async () => {
    setShowWin(true);

    await addBolts(15);

    const savedData = await AsyncStorage.getItem('CROSSWORD_DONE');
    const completedLevels = savedData ? JSON.parse(savedData) : [];

    if (!completedLevels.includes(level.id)) {
      completedLevels.push(level.id);

      await AsyncStorage.setItem(
        'CROSSWORD_DONE',
        JSON.stringify(completedLevels),
      );
    }
  };

  const resetLevel = () => {
    setMatrix(initialMatrix);
    setMovesLeft(level.moves ?? 30);
    setShowWin(false);
    setShowLose(false);

    outer: for (let r = 0; r < initialMatrix.length; r++) {
      for (let c = 0; c < initialMatrix[0].length; c++) {
        if (initialMatrix[r][c]) {
          setSelected({ rr: r, cc: c });
          const n = resolveActiveWord(level, bounds, r, c, 'across');
          setPreferredDir('across');
          setActiveWordNumber(n);
          break outer;
        }
      }
    }
  };

  const shareResult = () => {
    const shareMessage = showWin
      ? `Level Completed! I solved the "${level.title}" crossword in Wundercar Garage Crossword.`
      : `Game Over! I ran out of moves on the "${level.title}" crossword in Wundercar Garage Crossword.`;

    Share.share({
      message: shareMessage,
    });
  };

  const renderCell = (cell, rr, cc) => {
    if (!cell)
      return (
        <View key={`${rr}:${cc}`} style={[styles.cell, styles.cellEmpty]} />
      );

    const isSelected = selected.rr === rr && selected.cc === cc;
    const inActive = activePath.some(([r, c]) => r === rr && c === cc);

    return (
      <TouchableOpacity
        key={`${rr}:${cc}`}
        activeOpacity={0.9}
        onPress={() => pickCell(rr, cc)}
        style={[
          styles.cell,
          inActive && styles.cellActiveWord,
          isSelected && styles.cellSelected,
        ]}
      >
        {!!cell.numbers?.length && (
          <Text style={styles.cellNumber}>{cell.numbers[0]}</Text>
        )}
        <Text style={styles.cellText}>{cell.value || '?'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={backImg} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TextInput
          ref={hiddenInputRef}
          value=""
          onChangeText={t => applyLetter(t)}
          autoCorrect={false}
          autoCapitalize="characters"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
          keyboardType="default"
        />

        <View style={{ paddingTop: 70, flex: 1 }}>
          <LinearGradient colors={gradientColors} style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../assets/images/foundation_arrow-up.png')}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>{level.title}</Text>
          </LinearGradient>

          <View style={styles.gridWrap}>
            {matrix.map((row, rr) => (
              <View key={`r-${rr}`} style={styles.gridRow}>
                {row.map((cell, cc) => renderCell(cell, rr, cc))}
              </View>
            ))}
          </View>

          <View style={styles.cluesBox}>
            {level.words
              .slice()
              .sort((a, b) => a.number - b.number)
              .map(w => (
                <LinearGradient
                  colors={questionGradientColors}
                  style={{
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#9FD4E3',
                  }}
                  key={w.number}
                >
                  <View key={w.number} style={styles.clueItem}>
                    <Text style={styles.clueTitle}>
                      {w.number}. {w.clue}
                    </Text>
                  </View>
                </LinearGradient>
              ))}
          </View>
        </View>

        {(showWin || showLose) && (
          <ImageBackground source={resultBg} style={styles.resultScreen}>
            <View style={styles.modalCenter}>
              {showWin ? (
                <Image source={require('../assets/images/levelcompl.png')} />
              ) : (
                <Image source={require('../assets/images/gameover.png')} />
              )}

              <Text
                style={[
                  styles.subTitle,
                  { marginTop: 20 },
                  !showWin && { marginBottom: height * 0.1 },
                ]}
              >
                {showWin
                  ? 'Nice work. You solved the crossword.'
                  : 'You ran out of moves.'}
              </Text>

              {showWin && (
                <View>
                  <Text style={styles.subTitle}>You earned:</Text>
                  <Image
                    source={require('../assets/images/earnednuts.png')}
                    style={{ marginTop: 10, alignSelf: 'center' }}
                  />
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 40 }}>
                <TouchableOpacity onPress={shareResult} activeOpacity={0.7}>
                  <Image
                    source={
                      showWin
                        ? require('../assets/images/sharewin.png')
                        : require('../assets/images/sharelose.png')
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={resetLevel} activeOpacity={0.7}>
                  <ImageBackground
                    source={
                      showWin
                        ? require('../assets/images/againwin.png')
                        : require('../assets/images/againlose.png')
                    }
                    style={styles.againBtn}
                  >
                    <Text style={styles.againBtnText}>Try Again</Text>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.popToTop()}
                  activeOpacity={0.7}
                >
                  <Image
                    source={
                      showWin
                        ? require('../assets/images/homewin.png')
                        : require('../assets/images/homelose.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
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
  resultScreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backBtn: { position: 'absolute', left: 12 },
  headerText: { color: primaryTextColor, fontSize: 22, fontWeight: '900' },
  movesPill: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#fff6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  movesText: { fontWeight: '900', color: '#3C1C0F' },
  againBtnText: { fontSize: 20, fontFamily: wundercartFont, color: '#14243E' },
  gridWrap: {
    marginTop: 40,
    alignSelf: 'center',
    padding: 8,
  },
  gridRow: { flexDirection: 'row', justifyContent: 'center' },
  cell: {
    width: 44,
    height: 44,
    borderRadius: 5,
    margin: 3,
    backgroundColor: '#FDE0A5',
    borderWidth: 2,
    borderColor: '#FFB145',
    justifyContent: 'center',
    alignItems: 'center',
  },
  againBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 206,
    height: 41,
  },
  cellEmpty: { backgroundColor: 'transparent', borderWidth: 0 },
  cellSelected: { borderColor: '#FF6A00', transform: [{ scale: 1.02 }] },
  cellActiveWord: { backgroundColor: '#FDE0A5' },
  cellNumber: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 11,
    fontWeight: '900',
    color: '#3C1C0F',
  },
  cellText: { fontSize: 22, fontWeight: '700', color: '#3C1C0F' },
  cluesBox: {
    marginTop: 18,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  clueItem: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  clueTitle: { color: primaryTextColor, fontWeight: '700', fontSize: 16 },
  modalBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalCenter: {
    width: '90%',
    alignItems: 'center',
  },
  bigTitle: { fontSize: 34, fontWeight: '900', color: '#FF6A00' },
  subTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  rewardPill: {
    marginTop: 14,
    borderWidth: 2,
    borderColor: '#2D1B10',
    backgroundColor: '#FFE08A',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  rewardText: { fontSize: 18, fontWeight: '900', color: '#2D1B10' },
  primaryBtn: {
    marginTop: 18,
    backgroundColor: '#6ED6FF',
    borderRadius: 12,
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  primaryBtnText: { fontSize: 18, fontWeight: '900', color: '#0C2233' },
  smallBtn: {
    backgroundColor: '#6ED6FF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  smallBtnText: { fontWeight: '900', color: '#0C2233' },
});
