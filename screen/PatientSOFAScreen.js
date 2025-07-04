import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const PatientSOFAScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    respiration: '',
    isVentilated: false,
    platelets: '',
    bilirubin: '',
    cardiovascular: '',
    cns: '',
    renal: '',
  });

  const cardiovascularOptions = [
    { label: 'MAP ≥ 70 mmHg', value: '0' },
    { label: 'MAP < 70 mmHg', value: '1' },
    { label: 'Dopamine ≤ 5 หรือ Dobutamine', value: '2' },
    { label: 'Dopamine > 5 หรือ Epi/Norepi ≤ 0.1', value: '3' },
    { label: 'Dopamine > 15 หรือ Epi/Norepi > 0.1', value: '4' },
  ];

  const getRespirationScore = (value, isVentilated) => {
    const val = parseFloat(value);
    if (isNaN(val)) return 0;
    if (isVentilated) {
      if (val < 100) return 4;
      if (val < 200) return 3;
    }
    if (val < 300) return 2;
    if (val < 400) return 1;
    return 0;
  };

  const getPlateletScore = (value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return 0;
    if (val < 20) return 4;
    if (val < 50) return 3;
    if (val < 100) return 2;
    if (val < 150) return 1;
    return 0;
  };

  const getBilirubinScore = (value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return 0;
    if (val >= 12.0) return 4;
    if (val >= 6.0) return 3;
    if (val >= 2.0) return 2;
    if (val >= 1.2) return 1;
    return 0;
  };

  const getCnsScore = (value) => {
    const val = parseInt(value, 10);
    if (isNaN(val)) return 0;
    if (val < 6) return 4;
    if (val < 10) return 3;
    if (val < 13) return 2;
    if (val < 15) return 1;
    return 0;
  };

  const getRenalScore = (value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return 0;
    if (val >= 5.0) return 4;
    if (val >= 3.5) return 3;
    if (val >= 2.0) return 2;
    if (val >= 1.2) return 1;
    return 0;
  };

  const handleNext = () => {
    const respirationScore = getRespirationScore(formData.respiration, formData.isVentilated);
    const plateletScore = getPlateletScore(formData.platelets);
    const bilirubinScore = getBilirubinScore(formData.bilirubin);
    const cardiovascularScore = parseInt(formData.cardiovascular || 0);
    const cnsScore = getCnsScore(formData.cns);
    const renalScore = getRenalScore(formData.renal);

    const sofaScore =
      respirationScore +
      plateletScore +
      bilirubinScore +
      cardiovascularScore +
      cnsScore +
      renalScore;

    updatePatientData({
      assessment: { ...patientData.assessment, sofaValues: formData },
      results: { ...patientData.results, sofaScore },
    });

    navigation.navigate('PatientPriority');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>📊 ประเมินคะแนน SOFA</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>ℹ️ กรุณากรอกค่าทางการแพทย์เพื่อประเมินคะแนน SOFA</Text>
              </View>

              <Text style={styles.sectionTitle}>🫁 ประเมิน SOFA Score</Text>

              {/* Respiration */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ระบบหายใจ (PaO₂/FiO₂)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 350"
                  keyboardType="numeric"
                  value={formData.respiration}
                  onChangeText={text => setFormData({ ...formData, respiration: text })}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>ผู้ป่วยใช้เครื่องช่วยหายใจ?</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={formData.isVentilated ? "#0b6258" : "#f4f3f4"}
                    onValueChange={() => setFormData(prev => ({ ...prev, isVentilated: !prev.isVentilated }))}
                    value={formData.isVentilated}
                  />
                </View>
              </View>

              {/* Platelets */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>เกล็ดเลือด (Platelet x10³)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 150"
                  keyboardType="numeric"
                  value={formData.platelets}
                  onChangeText={text => setFormData({ ...formData, platelets: text })}
                />
              </View>

              {/* Bilirubin */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ตับ (Bilirubin mg/dL)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 1.0"
                  keyboardType="numeric"
                  value={formData.bilirubin}
                  onChangeText={text => setFormData({ ...formData, bilirubin: text })}
                />
              </View>

              {/* Cardiovascular */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ระบบไหลเวียนโลหิต (MAP/ยา)</Text>
                <View style={{
                  borderWidth: 1.5,
                  borderColor: '#b2dfd5',
                  borderRadius: 10,
                  backgroundColor: '#f6fffd',
                  marginTop: 2,
                  overflow: 'hidden',
                }}>
                  <Picker
                    selectedValue={formData.cardiovascular}
                    onValueChange={value => setFormData({ ...formData, cardiovascular: value })}
                    style={{ color: '#0b6258' }}
                    dropdownIconColor="#0b6258"
                  >
                    <Picker.Item label="กรุณาเลือก..." value="" />
                    {cardiovascularOptions.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* CNS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ระบบประสาท (GCS)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="3-15"
                  keyboardType="numeric"
                  value={formData.cns}
                  onChangeText={text => setFormData({ ...formData, cns: text })}
                />
              </View>

              {/* Renal */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ไต (Creatinine mg/dL)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 1.1"
                  keyboardType="numeric"
                  value={formData.renal}
                  onChangeText={text => setFormData({ ...formData, renal: text })}
                />
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>← ย้อนกลับ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.calculateButton} onPress={handleNext}>
                  <Text style={styles.calculateButtonText}>ต่อไป →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0b6258',
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
  input: {
    borderWidth: 1.5,
    borderColor: '#b2dfd5',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    backgroundColor: '#f6fffd',
    color: '#0b6258',
    marginTop: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  switchLabel: {
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
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PatientSOFAScreen;
