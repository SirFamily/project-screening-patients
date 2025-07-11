import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { PatientProvider } from './src/context/PatientContext';
import { StatusBar, Text, View, ActivityIndicator, StyleSheet, Button, Platform } from 'react-native';
import * as Font from 'expo-font';
import PwaInstallPrompt from './src/components/PwaInstallPrompt';

StatusBar.setHidden(true);

const fetchFonts = () => {
  return Font.loadAsync({
    'IBMPlexSans-Regular': require('./assets/fonts/IBMPlexSans-Regular.ttf'),
    'IBMPlexSans-Bold': require('./assets/fonts/IBMPlexSans-Bold.ttf'),
    'IBMPlexSans-Medium': require('./assets/fonts/IBMPlexSans-Medium.ttf'),
    'IBMPlexSansThai-Regular': require('./assets/fonts/IBMPlexSansThai-Regular.ttf'),
    'IBMPlexSansThai-Bold': require('./assets/fonts/IBMPlexSansThai-Bold.ttf'),
    'IBMPlexSansThai-SemiBold': require('./assets/fonts/IBMPlexSansThai-SemiBold.ttf'),
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <PatientProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <PwaInstallPrompt />
    </PatientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  installButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#0B6258',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  installText: {
    color: 'white',
    marginRight: 10,
    fontFamily: 'IBMPlexSansThai-SemiBold',
    fontSize: 16,
  },
  
});