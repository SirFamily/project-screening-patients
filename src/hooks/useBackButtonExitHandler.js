import { useCallback } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Custom hook to block the Android hardware back button on a screen.
 * When the screen is focused, it shows an alert and prevents the default back action.
 */
const useBackButtonExitHandler = () => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'ไม่สามารถย้อนกลับได้',
          'กรุณาใช้ปุ่มย้อนกลับในแอปพลิเคชันเท่านั้น',
          [{ text: 'ตกลง' }]
        );
        // Returning true prevents the default back action
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );
};

export default useBackButtonExitHandler;
