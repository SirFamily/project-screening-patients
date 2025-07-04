import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// --- Scoring Functions based on APACHE II Table ---
const getScore = (value, ranges) => {
  const val = parseFloat(value);
  if (isNaN(val)) return 0;
  for (const range of ranges) {
    if ((range.min === -Infinity || val >= range.min) && (range.max === Infinity || val <= range.max)) {
      return range.score;
    }
  }
  return 0;
};

const getTemperatureScore = (temp) => getScore(temp, [
  { min: 41, max: Infinity, score: 4 }, { min: 39, max: 40.9, score: 3 }, { min: 38.5, max: 38.9, score: 1 },
  { min: 36, max: 38.4, score: 0 }, { min: 34, max: 35.9, score: 1 }, { min: 32, max: 33.9, score: 2 },
  { min: 30, max: 31.9, score: 3 }, { min: -Infinity, max: 29.9, score: 4 },
]);

const getMapScore = (map) => getScore(map, [
  { min: 160, max: Infinity, score: 4 }, { min: 130, max: 159, score: 3 }, { min: 110, max: 129, score: 2 },
  { min: 70, max: 109, score: 0 }, { min: 50, max: 69, score: 2 }, { min: -Infinity, max: 49, score: 4 },
]);

const getHeartRateScore = (hr) => getScore(hr, [
  { min: 180, max: Infinity, score: 4 }, { min: 140, max: 179, score: 3 }, { min: 110, max: 139, score: 2 },
  { min: 70, max: 109, score: 0 }, { min: 55, max: 69, score: 2 }, { min: 40, max: 54, score: 3 }, { min: -Infinity, max: 39, score: 4 },
]);

const getRespiratoryRateScore = (rr) => getScore(rr, [
  { min: 50, max: Infinity, score: 4 }, { min: 35, max: 49, score: 3 }, { min: 25, max: 34, score: 2 },
  { min: 12, max: 24, score: 0 }, { min: 10, max: 11, score: 1 }, { min: 6, max: 9, score: 2 }, { min: -Infinity, max: 5, score: 4 },
]);

const getOxygenationScore = (fio2, value) => {
  const fio2Val = parseFloat(fio2);
  if (isNaN(fio2Val)) return 0;
  if (fio2Val >= 0.5) { // A-aDO2
    return getScore(value, [
      { min: 500, max: Infinity, score: 4 }, { min: 350, max: 499, score: 3 },
      { min: 200, max: 349, score: 2 }, { min: -Infinity, max: 199, score: 0 },
    ]);
  } else { // PaO2
    return getScore(value, [
      { min: 70, max: Infinity, score: 0 }, { min: 61, max: 70, score: 1 },
      { min: 55, max: 60, score: 3 }, { min: -Infinity, max: 54, score: 4 },
    ]);
  }
};

const getPhScore = (ph) => getScore(ph, [
  { min: 7.7, max: Infinity, score: 4 }, { min: 7.6, max: 7.69, score: 3 }, { min: 7.5, max: 7.59, score: 2 },
  { min: 7.33, max: 7.49, score: 0 }, { min: 7.25, max: 7.32, score: 2 }, { min: 7.15, max: 7.24, score: 3 }, { min: -Infinity, max: 7.14, score: 4 },
]);

const getHco3Score = (hco3) => getScore(hco3, [
  { min: 52, max: Infinity, score: 4 }, { min: 41, max: 51.9, score: 3 }, { min: 32, max: 40.9, score: 2 },
  { min: 22, max: 31.9, score: 0 }, { min: 18, max: 21.9, score: 2 }, { min: 15, max: 17.9, score: 3 }, { min: -Infinity, max: 14.9, score: 4 },
]);

const getSodiumScore = (na) => getScore(na, [
  { min: 180, max: Infinity, score: 4 }, { min: 160, max: 179, score: 3 }, { min: 155, max: 159, score: 2 },
  { min: 150, max: 154, score: 1 }, { min: 130, max: 149, score: 0 }, { min: 120, max: 129, score: 2 },
  { min: 111, max: 119, score: 3 }, { min: -Infinity, max: 110, score: 4 },
]);

const getPotassiumScore = (k) => getScore(k, [
  { min: 7, max: Infinity, score: 4 }, { min: 6, max: 6.9, score: 3 }, { min: 5.5, max: 5.9, score: 1 },
  { min: 3.5, max: 5.4, score: 0 }, { min: 3.0, max: 3.4, score: 1 }, { min: 2.5, max: 2.9, score: 2 }, { min: -Infinity, max: 2.4, score: 4 },
]);

const getCreatinineScore = (creat, isArf) => {
  const score = getScore(creat, [
    { min: 3.5, max: Infinity, score: 4 }, { min: 2.0, max: 3.4, score: 3 }, { min: 1.5, max: 1.9, score: 2 },
    { min: 0.6, max: 1.4, score: 0 }, { min: -Infinity, max: 0.5, score: 2 },
  ]);
  return isArf ? score * 2 : score;
};

const getHematocritScore = (hct) => getScore(hct, [
  { min: 60, max: Infinity, score: 4 }, { min: 50, max: 59.9, score: 2 }, { min: 46, max: 49.9, score: 1 },
  { min: 30, max: 45.9, score: 0 }, { min: 20, max: 29.9, score: 2 }, { min: -Infinity, max: 19.9, score: 4 },
]);

const getWbcScore = (wbc) => getScore(wbc, [
  { min: 40, max: Infinity, score: 4 }, { min: 20, max: 39.9, score: 2 }, { min: 15, max: 19.9, score: 1 },
  { min: 3, max: 14.9, score: 0 }, { min: 1, max: 2.9, score: 2 }, { min: -Infinity, max: 0.9, score: 4 },
]);

const getGcsScore = (gcs) => {
  const val = parseInt(gcs, 10);
  return isNaN(val) ? 0 : 15 - val;
};

const getAgeScore = (age) => getScore(age, [
  { min: 75, max: Infinity, score: 6 }, { min: 65, max: 74, score: 5 },
  { min: 55, max: 64, score: 3 }, { min: 45, max: 54, score: 2 }, { min: -Infinity, max: 44, score: 0 },
]);

const getChronicHealthScore = (status) => {
  if (status === 'non_op_or_emergency') return 5;
  if (status === 'elective_post_op') return 2;
  return 0;
};

const PatientAPACHEScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    temperature: '', map: '', hr: '', rr: '',
    fio2: '', oxygenationValue: '', acidBaseMode: 'ph', acidBaseValue: '',
    sodium: '', potassium: '', creatinine: '', isArf: false, hematocrit: '', wbc: '', gcs: '', age: '',
    chronicHealthStatus: 'none',
  });

  const handleNext = () => {
    const physiologyScore =
      getTemperatureScore(formData.temperature) +
      getMapScore(formData.map) +
      getHeartRateScore(formData.hr) +
      getRespiratoryRateScore(formData.rr) +
      getOxygenationScore(formData.fio2, formData.oxygenationValue) +
      (formData.acidBaseMode === 'ph' ? getPhScore(formData.acidBaseValue) : getHco3Score(formData.acidBaseValue)) +
      getSodiumScore(formData.sodium) +
      getPotassiumScore(formData.potassium) +
      getCreatinineScore(formData.creatinine, formData.isArf) +
      getHematocritScore(formData.hematocrit) +
      getWbcScore(formData.wbc) +
      getGcsScore(formData.gcs);

    const ageScore = getAgeScore(formData.age);
    const chronicScore = getChronicHealthScore(formData.chronicHealthStatus);

    const apacheScore = physiologyScore + ageScore + chronicScore;

    updatePatientData({
        assessment: { ...patientData.assessment, apacheValues: formData },
        results: { ...patientData.results, apacheScore },
    });
    navigation.navigate('PatientPriority');
  };

  const handleBack = () => navigation.goBack();

  const renderInput = (label, key, placeholder, keyboardType = 'numeric') => (
    <View style={styles.inputGroup} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={formData[key]}
        onChangeText={text => setFormData(prev => ({ ...prev, [key]: text }))}
      />
    </View>
  );

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
              <Text style={styles.cardHeaderText}>📊 ประเมินคะแนน APACHE II</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.sectionTitle}>Physiology Variables</Text>
              {renderInput('Temperature (°C)', 'temperature', 'e.g., 37.0')}
              {renderInput('Mean Arterial Pressure (mmHg)', 'map', 'e.g., 90')}
              {renderInput('Heart Rate (/min)', 'hr', 'e.g., 80')}
              {renderInput('Respiratory Rate (/min)', 'rr', 'e.g., 16')}

              <Text style={styles.subSectionTitle}>Oxygenation</Text>
              {renderInput('FiO₂', 'fio2', 'e.g., 0.4 (as a decimal)')}
              {renderInput('PaO₂ or A-aDO₂ (mmHg)', 'oxygenationValue', 'Enter value based on FiO₂')}
              <Text style={styles.helperText}>* กรอก PaO₂ ถ้า FiO₂ &lt; 0.5, หรือกรอก A-aDO₂ ถ้า FiO₂ ≥ 0.5</Text>

              <Text style={styles.subSectionTitle}>Acid-Base Balance</Text>
              <Picker
                selectedValue={formData.acidBaseMode}
                onValueChange={(itemValue) => setFormData(prev => ({ ...prev, acidBaseMode: itemValue }))}>
                <Picker.Item label="Arterial pH" value="ph" />
                <Picker.Item label="Serum HCO₃ (mEq/l)" value="hco3" />
              </Picker>
              {renderInput(formData.acidBaseMode === 'ph' ? 'Arterial pH' : 'Serum HCO₃', 'acidBaseValue', 'Enter value')}

              {renderInput('Serum Sodium (mEq/l)', 'sodium', 'e.g., 140')}
              {renderInput('Serum Potassium (mEq/l)', 'potassium', 'e.g., 4.0')}
              {renderInput('Serum Creatinine (mg/dl)', 'creatinine', 'e.g., 1.0')}
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Acute Renal Failure?</Text>
                <Switch value={formData.isArf} onValueChange={val => setFormData(prev => ({ ...prev, isArf: val }))} />
              </View>
              {renderInput('Hematocrit (%)', 'hematocrit', 'e.g., 45')}
              {renderInput('White Blood Count (x1000/mm³)', 'wbc', 'e.g., 8.0')}
              {renderInput('Glasgow Coma Score', 'gcs', '3-15')}

              <Text style={styles.sectionTitle}>Age & Chronic Health</Text>
              {renderInput('Age (years)', 'age', 'e.g., 55')}
              <Text style={styles.label}>Chronic Health Status</Text>
              <Picker
                selectedValue={formData.chronicHealthStatus}
                onValueChange={(itemValue) => setFormData(prev => ({ ...prev, chronicHealthStatus: itemValue }))}>
                <Picker.Item label="None" value="none" />
                <Picker.Item label="Non-operative or Emergency Post-operative" value="non_op_or_emergency" />
                <Picker.Item label="Elective Post-operative" value="elective_post_op" />
              </Picker>

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
  container: { flexGrow: 1, backgroundColor: '#eafaf7', padding: 10 },
  card: { backgroundColor: 'white', borderRadius: 18, elevation: 6, marginVertical: 20 },
  cardHeader: { backgroundColor: '#0b6258', padding: 18, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  cardHeaderText: { color: 'white', fontSize: 19, fontWeight: '700' },
  cardBody: { padding: 22 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0b6258', marginTop: 15, marginBottom: 10, borderBottomWidth: 1, borderColor: '#b2dfd5', paddingBottom: 5 },
  subSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0b6258', marginTop: 10, marginBottom: 5 },
  inputGroup: { marginBottom: 12 },
  label: { marginBottom: 8, fontSize: 15, color: '#0b6258', fontWeight: '600' },
  input: { borderWidth: 1.5, borderColor: '#b2dfd5', borderRadius: 10, padding: 13, fontSize: 16, backgroundColor: '#f6fffd', color: '#0b6258' },
  helperText: { fontSize: 12, color: '#555', marginTop: -5, marginBottom: 10 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, paddingHorizontal: 5 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
  backButton: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#0b6258', borderRadius: 30, paddingVertical: 14, flex: 1, alignItems: 'center' },
  backButtonText: { color: '#0b6258', fontSize: 16, fontWeight: '700' },
  calculateButton: { backgroundColor: '#0b6258', borderRadius: 30, paddingVertical: 14, flex: 1, alignItems: 'center' },
  calculateButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },
});

export default PatientAPACHEScreen;
