import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const nursingGuidelines = {
  '1-4': {
    general: [
      'Screen and identify critical patients',
      'Assess V/S every 1 hour',
      'Resuscitation equipment and defibrillator ready',
      'Experienced nurses or nurses with critical care training',
      'Use REH scoring for every shift',
      'Report to physician if changes or GCS drops by ≥2 points',
      'Use ISBAR for case reporting',
    ],
    icu_case_note: 'If ICU case, consider transferring patient to general ward/semi-ICU as first priority.'
  },
  '5-6': {
    general: [
      'Screen and identify critical patients, transfer to semi-critical zone',
      'Assess V/S every 1 hour',
      'Resuscitation equipment and defibrillator ready',
      'Experienced nurses or nurses with critical care training',
      'Use REH scoring for every shift',
      'Report to physician if changes or GCS drops by ≥2 points',
      'Use ISBAR for case reporting',
    ],
    icu_case_note: 'If ICU case, consider transferring patient to general ward/semi-ICU as second priority.'
  },
  '7_no_icu': [
    'Screen and identify critical patients, transfer to critical zone near nursing counter',
    'Assess V/S every 1 hour',
    'Resuscitation equipment and defibrillator ready',
    'Experienced nurses or nurses with critical care training',
    'Use REH scoring for every shift',
    'Report to physician if changes or GCS drops by ≥2 points',
    'Use ISBAR for case reporting',
    'Consider daily ICU bed reservation',
  ],
  '7_with_icu': [
    'Provide care according to ICU standards',
  ],
};

const EvaluationResultScreen = () => {
  const { patientData } = usePatientContext();
  const navigation = useNavigation();
  const { 
    info: { firstName, lastName, hn, ward }, 
    assessment: { type: assessmentType },
    results: { 
      sofaScore, apacheScore, 
      priorityRehScore, 
      cciScore, cciRehScore, 
      totalRehScore, riskLevel 
    }
  } = patientData;

  const assessmentScore = assessmentType === 'SOFA' ? sofaScore : apacheScore;

  const handleNewPatient = () => {
    // Here you might want to call resetPatientData()
    navigation.navigate('PatientInfo');
  };

  const renderDetail = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value !== undefined && value !== null ? value : 'N/A'}</Text>
    </View>
  );

  const getGuidelines = () => {
    if (totalRehScore >= 7) {
      if (ward === 'ICU') {
        return nursingGuidelines['7_with_icu'];
      } else {
        return nursingGuidelines['7_no_icu'];
      }
    } else if (totalRehScore >= 5) {
      return nursingGuidelines['5-6'].general;
    } else { // 1-4
      return nursingGuidelines['1-4'].general;
    }
  };

  const getIcuCaseNote = () => {
    if (patientData.info.ward === 'ICU') { // Only show ICU case note if the patient is in ICU ward
      if (totalRehScore >= 5 && totalRehScore <= 6) {
        return nursingGuidelines['5-6'].icu_case_note;
      } else if (totalRehScore >= 1 && totalRehScore <= 4) {
        return nursingGuidelines['1-4'].icu_case_note;
      }
    }
    return null;
  };

  const guidelines = getGuidelines();
  const icuCaseNote = getIcuCaseNote();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>📋 Evaluation Result</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            {renderDetail('Name:', `${firstName} ${lastName}`)}
            {renderDetail('HN:', hn)}
            {renderDetail('Ward:', ward)}

            <Text style={styles.sectionTitle}>Scores</Text>
            {renderDetail(`${assessmentType} Score:`, assessmentScore)}
            {renderDetail('Priority (REH) Score:', priorityRehScore)}
            {renderDetail('CCI Score:', cciScore)}
            {renderDetail('CCI (REH) Score:', cciRehScore)}
            <View style={styles.totalScoreContainer}>
              <Text style={styles.totalScoreLabel}>Total REH Score:</Text>
              <Text style={styles.totalScoreValue}>{totalRehScore}</Text>
            </View>

            <View style={styles.riskLevelContainer}>
              <Text style={styles.riskLevelLabel}>Risk Assessment Result:</Text>
              <Text style={styles.riskLevelValue}>{riskLevel}</Text>
            </View>

            <Text style={styles.sectionTitle}>Nursing Care Guidelines</Text>
            {guidelines.map((item, index) => (
              <Text key={index} style={styles.guidelineItem}>• {item}</Text>
            ))}
            {icuCaseNote && <Text style={styles.icuCaseNote}>*** {icuCaseNote}</Text>}

            <TouchableOpacity style={styles.newPatientButton} onPress={handleNewPatient}>
              <Text style={styles.newPatientButtonText}>Assess New Patient</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eafaf7',
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 18,
        elevation: 8,
        shadowColor: '#0b6258',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardHeader: {
        backgroundColor: '#0b6258',
        padding: 20,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    cardHeaderText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardBody: {
        padding: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0b6258',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#b2dfd5',
        paddingBottom: 8,
        marginTop: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 5,
    },
    detailLabel: {
        fontSize: 16,
        color: '#333',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0b6258',
    },
    totalScoreContainer: {
        backgroundColor: '#b2dfd5',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    totalScoreLabel: {
        fontSize: 18,
        color: '#0b6258',
        fontWeight: '600',
    },
    totalScoreValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0b6258',
        marginTop: 5,
    },
    riskLevelContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f6fffd',
        borderWidth: 1,
        borderColor: '#0b6258',
    },
    riskLevelLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0b6258',
        textAlign: 'center',
    },
    riskLevelValue: {
        fontSize: 16,
        color: '#D32F2F',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: 'bold',
    },
    guidelineItem: {
        fontSize: 15,
        color: '#333',
        marginBottom: 8,
        paddingLeft: 10,
    },
    icuCaseNote: {
        fontSize: 15,
        color: '#D32F2F',
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    newPatientButton: {
        backgroundColor: '#0b6258',
        borderRadius: 30,
        paddingVertical: 15,
        marginTop: 30,
        elevation: 2,
    },
    newPatientButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EvaluationResultScreen;