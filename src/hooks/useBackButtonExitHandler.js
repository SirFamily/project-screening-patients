import { useEffect, useState, useCallback } from 'react';
import { BackHandler, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { usePatientContext } from '../context/PatientContext';

const useBackButtonExitHandler = (navigation) => {
  const { resetPatientData } = usePatientContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleConfirmExit = useCallback(() => {
    setShowExitModal(false);
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
  }, [navigation, resetPatientData]);

  const handleCancelExit = useCallback(() => {
    setShowExitModal(false);
  }, []);

  useEffect(() => {
    const backAction = () => {
      setShowExitModal(true); // Show the custom modal
      return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []); // No dependency on navigation or resetPatientData here, as they are handled by useCallback

  return { showExitModal, handleConfirmExit, handleCancelExit };
};

export default useBackButtonExitHandler;