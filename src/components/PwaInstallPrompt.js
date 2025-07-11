
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';

const PwaInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setInstallPrompt(e);
      });

      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      setIsIOS(isIOSDevice);
    }
  }, []);

  const handleInstallPress = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };

  if (isIOS) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>แตะที่ปุ่ม "แชร์" จากนั้นเลือก "เพิ่มไปยังหน้าจอโฮม" เพื่อติดตั้งแอปพลิเคชัน</Text>
      </View>
    );
  }

  if (!installPrompt) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ติดตั้งแอปพลิเคชันเพื่อประสบการณ์ที่ดียิ่งขึ้น</Text>
      <TouchableOpacity style={styles.button} onPress={handleInstallPress}>
        <Text style={styles.buttonText}>ติดตั้ง</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0B6258',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#0B6258',
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Bold',
  },
});

export default PwaInstallPrompt;
