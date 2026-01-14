import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';

export const StoreContext = createContext(undefined);

export const useStore = () => {
  return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
  const [bolts, setBolts] = useState(0);

  const loadBolts = async () => {
    const savedBolts = await AsyncStorage.getItem('earned_nuts');

    const nuts = savedBolts ? Number(savedBolts) : 0;

    setBolts(nuts);
  };

  const spendBolts = async cost => {
    if (bolts < cost) {
      return false;
    }

    const remainingBolts = bolts - cost;

    setBolts(remainingBolts);

    await AsyncStorage.setItem('earned_nuts', String(remainingBolts));

    console.log('saved');

    return true;
  };

  const contextValue = {
    bolts,
    setBolts,
    loadBolts,
    spendBolts,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
