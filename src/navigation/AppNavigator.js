import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all screens
import HomeScreen from '../screen/HomeScreen';
import PatientInfoScreen from '../screen/PatientInfoScreen';
import AssessmentSelectionScreen from '../screen/AssessmentSelectionScreen';
import PatientSOFAScreen from '../screen/PatientSOFAScreen';
import PatientAPACHEScreen from '../screen/PatientAPACHEScreen';
import PatientCCIScreen from '../screen/PatientCCIScreen';
import PatientPriorityScreen from '../screen/PatientPriorityScreen';
import EvaluationResultScreen from '../screen/EvaluationResultScreen';
import SavedRecordsScreen from '../screen/SavedRecordsScreen';
import RecordDetailScreen from '../screen/RecordDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="IcuScoring"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="IcuScoring" component={HomeScreen} />
            <Stack.Screen name="PatientInfo" component={PatientInfoScreen} />
            <Stack.Screen name="AssessmentSelection" component={AssessmentSelectionScreen} />
            <Stack.Screen name="PatientSOFA" component={PatientSOFAScreen} />
            <Stack.Screen name="PatientAPACHE" component={PatientAPACHEScreen} />
            <Stack.Screen name="PatientCCI" component={PatientCCIScreen} />
            <Stack.Screen name="PatientPriority" component={PatientPriorityScreen} />
            <Stack.Screen name="EvaluationResult" component={EvaluationResultScreen} />
            <Stack.Screen name="SavedRecords" component={SavedRecordsScreen} />
            <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
        </Stack.Navigator>
    );
}
