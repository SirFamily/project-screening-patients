
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const PatientPriorityScreen = () => {
  const { updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [priority, setPriority] = useState('');

  const priorityOptions = [
    { label: '-- กรุณาเลือก --', value: '' },
    { label: 'ระดับ 1: ผู้ป่วยวิกฤต ต้องอยู่ใน ICU', value: '4' },
    { label: 'ระดับ 2: ผู้ป่วยที่ต้องการเฝ้าระวังอย่างใกล้ชิด', value: '3' },
    { label: 'ระดับ 3: ผู้ป่วยวิกฤตที่มีโอกาสหายยาก', value: '2' },
    { label: 'ระดับ 4: ผู้ป่วยอาการคงที่ ไม่จำเป็นต้องอยู่ใน ICU', value: '0' },
  ];

  const handleNext = () => {
    updatePatientData({ priorityScore: parseInt(priority || 0) });
    navigation.navigate('PatientCCI');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>⚠️ ประเมิน Priority</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ กรุณาเลือกระดับความเร่งด่วนของผู้ป่วย</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority (ระดับความเร่งด่วน)</Text>
              <View style={styles.optionsContainer}>
                {priorityOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      priority === option.value && styles.selectedOption
                    ]}
                    onPress={() => setPriority(option.value)}
                  >
                    <Text style={priority === option.value ? styles.selectedOptionText : styles.optionText}>
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
                style={[styles.nextButton, !priority && styles.nextButtonDisabled]} 
                onPress={handleNext}
                disabled={!priority}
              >
                <Text style={styles.nextButtonText}>ต่อไป →</Text>
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
      nextButton: {
        backgroundColor: '#0b6258',
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 36,
        flex: 1,
        alignItems: 'center',
      },
      nextButtonDisabled: {
        backgroundColor: '#b2dfd5',
      },
      nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
      },
});

export default PatientPriorityScreen;
