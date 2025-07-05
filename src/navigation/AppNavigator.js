// src/navigation/AppNavigator.js
import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';
import PatientInfoScreen from '../screen/PatientInfoScreen';
import AssessmentSelectionScreen from '../screen/AssessmentSelectionScreen';

import PatientSOFAScreen from '../screen/PatientSOFAScreen';
import PatientAPACHEScreen from '../screen/PatientAPACHEScreen';
import PatientPriorityScreen from '../screen/PatientPriorityScreen';
import PatientCCIScreen from '../screen/PatientCCIScreen';
import EvaluationResultScreen from '../screen/EvaluationResultScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const navigation = useNavigation();
    useBackButtonExitHandler(navigation);

    return (
        <Stack.Navigator
            initialRouteName="PatientInfo"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="PatientInfo" component={PatientInfoScreen} />
            <Stack.Screen name="AssessmentSelection" component={AssessmentSelectionScreen} />
            <Stack.Screen name="PatientSOFA" component={PatientSOFAScreen} />
            <Stack.Screen name="PatientAPACHE" component={PatientAPACHEScreen} />
            <Stack.Screen name="PatientPriority" component={PatientPriorityScreen} />
            <Stack.Screen name="PatientCCI" component={PatientCCIScreen} />
            <Stack.Screen name="EvaluationResult" component={EvaluationResultScreen} />
        </Stack.Navigator>
    );
}
