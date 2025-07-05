import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { usePatientContext } from '../context/PatientContext';

const useBackButtonExitHandler = (navigation) => {
  const { resetPatientData } = usePatientContext();

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'ออกจากแอป',
        'คุณต้องการออกจากแอปพลิเคชันหรือไม่? ข้อมูลทั้งหมดจะถูกรีเซ็ต',
        [
          {
            text: 'ไม่',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'ใช่',
            onPress: () => {
              resetPatientData(); // Call the reset function from PatientContext

              // Navigate to the initial screen (e.g., 'Home') and reset the navigation stack
              if (navigation) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'PatientInfo' }], // <<< IMPORTANT: Replace 'Home' with the actual name of your initial screen route
                  })
                );
              }

              // Exit the app
              BackHandler.exitApp();
            },
          },
        ],
        { cancelable: false }
      );
      return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]); // Re-run effect if navigation object changes
};

export default useBackButtonExitHandler;
