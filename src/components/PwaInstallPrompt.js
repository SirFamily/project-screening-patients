
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';

const PwaInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setInstallPrompt(e);
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOSDevice) {
        const isStandalone = ('standalone' in window.navigator) && (window.navigator.standalone);
        if (!isStandalone) {
          setIsIOS(true);
          setIsVisible(true);
        }
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallPress = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
      setIsVisible(false);
    });
  };

  const handleClosePress = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const PromptContent = () => (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.text}>
          {isIOS
            ? 'แตะที่ปุ่ม "แชร์" จากนั้นเลือก "เพิ่มไปยังหน้าจอโฮม" เพื่อติดตั้ง'
            : 'ติดตั้งแอปพลิเคชันเพื่อประสบการณ์ที่ดียิ่งขึ้น'}
        </Text>
        {!isIOS && installPrompt && (
          <TouchableOpacity style={styles.button} onPress={handleInstallPress}>
            <Text style={styles.buttonText}>ติดตั้ง</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  if (isIOS || installPrompt) {
    return <PromptContent />;
  }

  return null;
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16, 
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    flexShrink: 1, 
    marginRight: 10,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  buttonText: {
    color: '#0B6258',
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PwaInstallPrompt;
