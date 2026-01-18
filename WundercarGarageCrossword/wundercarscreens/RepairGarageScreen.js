import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { isSmallPhone, isMediumPhone } from '../constants/useScreen';
import { useStore } from '../wundercaststore/garageContext';

const REPAIR_COST = 15;

const garageBg = require('../assets/images/garage_back.png');
const boltIcon = require('../assets/images/homeQ.png');
const wrenchIcon = require('../assets/images/wrench.png');
const wundercartFont = 'impact';

const garageVehicles = [
  {
    id: 'pickup_green',
    damaged: require('../assets/images/pickup_damaged.png'),
    repaired: require('../assets/images/pickup_repaired.png'),
  },
  {
    id: 'jeep_white',
    damaged: require('../assets/images/jeep_damaged.png'),
    repaired: require('../assets/images/jeep_repaired.png'),
  },
  {
    id: 'pickup_black',
    damaged: require('../assets/images/pickup_black_damaged.png'),
    repaired: require('../assets/images/pickup_black_repaired.png'),
  },
  {
    id: 'bike',
    damaged: require('../assets/images/bike_damaged.png'),
    repaired: require('../assets/images/bike_repaired.png'),
  },
  {
    id: 'muscle_car',
    damaged: require('../assets/images/muscle_damaged.png'),
    repaired: require('../assets/images/muscle_repaired.png'),
  },
];

export default function RepairGarageScreen({ navigation }) {
  const [garageState, setGarageState] = useState({});
  const [showRepair, setShowRepair] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { width, height } = useWindowDimensions();
  const { bolts, spendBolts, loadBolts } = useStore();

  useFocusEffect(
    useCallback(() => {
      loadBolts();
      loadGarageState();
    }, []),
  );
  const loadGarageState = async () => {
    const savedGarageState = await AsyncStorage.getItem('GARAGE_STATE');

    const garageStateJSON = savedGarageState
      ? JSON.parse(savedGarageState)
      : {};

    setGarageState(garageStateJSON);
  };

  const onRepairPress = vehicleId => {
    if (garageState[vehicleId]) return;
    setSelectedVehicle(vehicleId);
    setShowRepair(true);
  };

  const confirmRepair = async () => {
    const ok = await spendBolts(REPAIR_COST);
    if (!ok) return;

    const nextState = {
      ...garageState,
      [selectedVehicle]: true,
    };

    setGarageState(nextState);
    await AsyncStorage.setItem('GARAGE_STATE', JSON.stringify(nextState));

    setShowRepair(false);
    setSelectedVehicle(null);
  };

  return (
    <ImageBackground source={garageBg} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingTop: height * 0.08 }}
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

            <Text style={styles.wundercarHeadTub}>Garage</Text>
          </LinearGradient>
          <ImageBackground
            style={[styles.wundercarQCont, { top: height * 0.075, right: 30 }]}
            source={require('../assets/images/qFrame.png')}
          >
            <Text
              style={[styles.wundercarQText, isSmallPhone && { fontSize: 14 }]}
            >
              {bolts}
            </Text>
            <Image source={require('../assets/images/homeQ.png')} />
          </ImageBackground>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: height * 0.04,
          }}
        >
          <View style={styles.vehiclesWrap}>
            {garageVehicles.map(v => {
              const repaired = garageState[v.id];

              return (
                <View key={v.id} style={styles.vehicleBox}>
                  <Image
                    source={repaired ? v.repaired : v.damaged}
                    style={styles.vehicleImg}
                  />

                  {!repaired && (
                    <TouchableOpacity
                      style={styles.repairBtn}
                      onPress={() => onRepairPress(v.id)}
                    >
                      <Image
                        source={wrenchIcon}
                        style={{ width: 35, height: 35 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {showRepair && (
          <View style={styles.overlay}>
            <View style={styles.repairBox}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowRepair(false)}
              >
                <Image source={require('../assets/images/close.png')} />
              </TouchableOpacity>

              <Text style={styles.repairTitle}>Repair for:</Text>

              <View style={styles.repairCost}>
                <Text style={styles.repairCostText}>x{REPAIR_COST}</Text>
                <Image source={boltIcon} style={{ width: 33, height: 31 }} />
              </View>

              <View style={styles.repairBtns}>
                <TouchableOpacity onPress={() => setShowRepair(false)}>
                  <LinearGradient
                    colors={['#FEE08E', '#FEAE06']}
                    style={styles.noBtn}
                  >
                    <Text style={styles.btnText}>No</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={bolts < REPAIR_COST}
                  onPress={confirmRepair}
                >
                  <LinearGradient
                    colors={['#FEE08E', '#FEAE06']}
                    style={styles.noBtn}
                  >
                    <Text style={styles.btnText}>Yes</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: '#FFD45C',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wundercarQCont: {
    width: 77,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 5,
    position: 'absolute',
  },
  wundercarQText: {
    color: '#431C0D',
    fontSize: 16,
    fontFamily: wundercartFont,
  },
  wundercarHeadTub: {
    color: '#3C1C0F',
    fontSize: isSmallPhone ? 20 : 24,
    fontFamily: wundercartFont,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2D1B10',
  },
  boltsPill: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#FFD45C',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boltsText: {
    fontWeight: '900',
    fontSize: 16,
    color: '#2D1B10',
  },
  vehiclesWrap: {
    marginTop: 120,
    gap: 20,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  vehicleBox: {
    width: isMediumPhone ? 180 : 160,
    height: 120,
  },
  vehicleImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  repairBtn: {
    position: 'absolute',
    bottom: 58,
    right: 70,
    padding: 6,
    width: 40,
    height: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repairBox: {
    width: 200,
    backgroundColor: '#F2422B',
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  closeBtn: {
    position: 'absolute',
    right: 3,
    top: 4,
  },
  repairTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  repairCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 12,
  },
  repairCostText: {
    fontSize: 18,
    fontWeight: '900',
  },
  repairBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 20,
  },
  noBtn: {
    width: 62,
    borderRadius: 6,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontWeight: '400',
    color: '#120804',
    fontSize: 16,
  },
});
