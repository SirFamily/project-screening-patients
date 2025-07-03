// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { PatientProvider } from './context/PatientContext';

export default function App() {
  return (
    <PatientProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PatientProvider>
  );
}