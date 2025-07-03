// src/navigation/AppNavigator.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientInfoScreen from '../screen/PatientInfoScreen';
import AssessmentSelectionScreen from '../screen/AssessmentSelectionScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="PatientInfo"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="PatientInfo" component={PatientInfoScreen} />
            <Stack.Screen name="AssessmentSelection" component={AssessmentSelectionScreen} />
        </Stack.Navigator>
    );
}