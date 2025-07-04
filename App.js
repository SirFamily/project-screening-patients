import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { PatientProvider } from './context/PatientContext';
import { StatusBar, Text } from 'react-native';
import * as Font from 'expo-font';

StatusBar.setHidden(true);

const fetchFonts = () => {
  return Font.loadAsync({
    'IBMPlexSans-Regular': require('./assets/fonts/IBMPlexSans-Regular.ttf'),
    'IBMPlexSans-Bold': require('./assets/fonts/IBMPlexSans-Bold.ttf'),
    'IBMPlexSansThai-Regular': require('./assets/fonts/IBMPlexSansThai-Regular.ttf'),
    'IBMPlexSansThai-Bold': require('./assets/fonts/IBMPlexSansThai-Bold.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontLoaded(true);
      }
    }

    loadResources();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

  return (
    <PatientProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PatientProvider>
  );
}