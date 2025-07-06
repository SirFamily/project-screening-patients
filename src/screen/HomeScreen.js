import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';

const HomeScreen = () => {
  const navigation = useNavigation();
  useBackButtonExitHandler();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B6258" />
      <View style={styles.container}>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <Text style={styles.title}>ICU scoring</Text>
          <Text style={styles.subtitle}>แอปพลิเคชันคัดกรองผู้ป่วย</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={300} style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('PatientInfo')}
          >
            <Text style={styles.buttonIcon}>🩺</Text>
            <Text style={styles.buttonText}>กรองผู้ป่วยใหม่</Text>
            <Text style={styles.buttonSubtext}>New Screening</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('SavedRecords')}
          >
            <Text style={styles.buttonIcon}>📂</Text>
            <Text style={styles.buttonText}>รายการที่บันทึกไว้</Text>
            <Text style={styles.buttonSubtext}>Saved Records</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B6258' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontFamily: 'IBMPlexSans-Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: 'IBMPlexSansThai-Regular',
    fontSize: 18,
    color: '#E0F2F1',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  buttonText: {
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 20,
    color: '#0B6258',
  },
  buttonSubtext: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 14,
    color: '#2C3E50',
    marginTop: 4,
  },
});

export default HomeScreen;
