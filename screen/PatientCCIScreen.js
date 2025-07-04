
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const PatientCCIScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [cci, setCci] = useState('');

  const cciOptions = [
    { label: '-- กรุณาเลือก --', value: '' },
    { label: '0-2: โรคเบาหวาน, ความดันโลหิตสูง, ฯลฯ', value: '2' },
    { label: '3-4: โรคอัมพาต, โรคไตวายเรื้อรัง, ฯลฯ', value: '1' },
    { label: '>4: โรคตับแข็ง, มะเร็งระยะแพร่กระจาย, ฯลฯ', value: '0' },
  ];

  const calculateScore = () => {
    const { sofaScore, apacheScore, priorityScore } = patientData;
    const cciScore = parseInt(cci || 0);

    let totalScore = priorityScore + cciScore;
    let assessmentScore = 0;

    if (patientData.assessmentType === 'SOFA') {
        assessmentScore = sofaScore;
        if (assessmentScore <= 6) totalScore += 2;
        else if (assessmentScore <= 9) totalScore += 3;
        else if (assessmentScore <= 12) totalScore += 4;
        else if (assessmentScore <= 15) totalScore += 2;
    } else {
        assessmentScore = apacheScore;
        if (assessmentScore <= 9) totalScore += 2;
        else if (assessmentScore <= 14) totalScore += 3;
        else if (assessmentScore <= 19) totalScore += 4;
        else if (assessmentScore <= 24) totalScore += 2;
    }

    let riskLevel = "";
    if (totalScore >= 7) riskLevel = "ความเสี่ยงสูง";
    else if (totalScore >= 5) riskLevel = "ความเสี่ยงปานกลาง";
    else riskLevel = "ความเสี่ยงต่ำ";

    updatePatientData({
      cciScore,
      totalScore,
      riskLevel
    });

    navigation.navigate('EvaluationResult');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>🩺 ประเมิน CCI</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ กรุณาเลือกกลุ่มโรคของผู้ป่วย</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CCI (Charlson Comorbidity Index)</Text>
              <View style={styles.optionsContainer}>
                {cciOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      cci === option.value && styles.selectedOption
                    ]}
                    onPress={() => setCci(option.value)}
                  >
                    <Text style={cci === option.value ? styles.selectedOptionText : styles.optionText}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>← ย้อนกลับ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.calculateButton, !cci && styles.calculateButtonDisabled]} 
                onPress={calculateScore}
                disabled={!cci}
              >
                <Text style={styles.calculateButtonText}>คำนวณคะแนน</Text>
              </TouchableOpacity>
            </View>
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
        paddingBottom: 60,
      },
      card: {
        backgroundColor: 'white',
        borderRadius: 18,
        elevation: 6,
        marginBottom: 25,
        overflow: 'hidden',
        shadowColor: '#0b6258',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      cardHeader: {
        backgroundColor: '#0b6258',
        padding: 18,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
      },
      cardHeaderText: {
        color: 'white',
        fontSize: 19,
        fontWeight: '700',
        letterSpacing: 0.5,
      },
      cardBody: {
        padding: 22,
      },
      infoBox: {
        backgroundColor: '#b2dfd5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
      },
      infoText: {
        color: '#0b6258',
        fontSize: 16,
        fontWeight: '600',
      },
      inputGroup: {
        marginBottom: 18,
      },
      label: {
        marginBottom: 8,
        fontSize: 15,
        color: '#0b6258',
        fontWeight: '600',
      },
      optionsContainer: {
        marginTop: 5,
      },
      optionButton: {
        padding: 13,
        borderWidth: 1.5,
        borderColor: '#b2dfd5',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#f6fffd',
      },
      selectedOption: {
        backgroundColor: '#0b6258',
        borderColor: '#0b6258',
      },
      optionText: {
        color: '#0b6258',
        fontWeight: '500',
        fontSize: 15,
      },
      selectedOptionText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
      },
      buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
      },
      backButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#0b6258',
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 36,
        flex: 1,
        alignItems: 'center',
      },
      backButtonText: {
        color: '#0b6258',
        fontSize: 16,
        fontWeight: '700',
      },
      calculateButton: {
        backgroundColor: '#0b6258',
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 36,
        flex: 1,
        alignItems: 'center',
      },
      calculateButtonDisabled: {
        backgroundColor: '#b2dfd5',
      },
      calculateButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
      },
});

export default PatientCCIScreen;
