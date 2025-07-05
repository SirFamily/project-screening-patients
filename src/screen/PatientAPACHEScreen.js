import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  Switch, KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

// --- Scoring Functions (Copied from original file) ---
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
  if (isNaN(fio2Val) || !value) return 0;
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
  if (isNaN(val) || val < 3 || val > 15) return 0;
  return 15 - val;
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
// --- End Scoring Functions ---

const ScoreInputCard = ({ icon, title, description, score, children }) => (
  <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreBadgeText}>{score}</Text>
      </View>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </Animatable.View>
);

const PatientAPACHEScreen = () => {
  const navigation = useNavigation();
  const { patientData, updatePatientData } = usePatientContext();
  const [formData, setFormData] = useState({
    temperature: '', map: '', hr: '', rr: '',
    fio2: '', oxygenationValue: '', acidBaseMode: 'ph', acidBaseValue: '',
    sodium: '', potassium: '', creatinine: '', isArf: false, hematocrit: '', wbc: '', gcs: '', age: '',
    chronicHealthStatus: 'none',
  });

  const scores = useMemo(() => ({
    temperature: getTemperatureScore(formData.temperature),
    map: getMapScore(formData.map),
    hr: getHeartRateScore(formData.hr),
    rr: getRespiratoryRateScore(formData.rr),
    oxygenation: getOxygenationScore(formData.fio2, formData.oxygenationValue),
    acidBase: formData.acidBaseMode === 'ph' ? getPhScore(formData.acidBaseValue) : getHco3Score(formData.acidBaseValue),
    sodium: getSodiumScore(formData.sodium),
    potassium: getPotassiumScore(formData.potassium),
    creatinine: getCreatinineScore(formData.creatinine, formData.isArf),
    hematocrit: getHematocritScore(formData.hematocrit),
    wbc: getWbcScore(formData.wbc),
    gcs: getGcsScore(formData.gcs),
    age: getAgeScore(formData.age),
    chronicHealth: getChronicHealthScore(formData.chronicHealthStatus),
  }), [formData]);

  const physiologyScore = scores.temperature + scores.map + scores.hr + scores.rr + scores.oxygenation + scores.acidBase + scores.sodium + scores.potassium + scores.creatinine + scores.hematocrit + scores.wbc + scores.gcs;
  const totalApacheScore = physiologyScore + scores.age + scores.chronicHealth;

  const handleNext = () => {
    updatePatientData({
      assessment: { ...patientData.assessment, apacheValues: formData },
      results: { ...patientData.results, apacheScore: totalApacheScore },
    });
    navigation.navigate('PatientPriority');
  };

  const isFormValid = !Object.values(formData).some(v => v === '' || v === null);

  const renderInput = (key, placeholder) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={formData[key]}
      onChangeText={text => setFormData(prev => ({ ...prev, [key]: text }))}
      keyboardType="numeric"
      placeholderTextColor="#9DA8B7"
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>APACHE II Score</Text>
        <View style={styles.totalScoreCircle}>
          <Text style={styles.totalScoreLabel}>Total</Text>
          <Text style={styles.totalScoreValue}>{totalApacheScore}</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>
          <ScoreInputCard icon="🌡️" title="Temperature" description="(°C)" score={scores.temperature}>{renderInput('temperature', 'e.g., 37.0')}</ScoreInputCard>
          <ScoreInputCard icon="📈" title="Mean Arterial Pressure MAP" description="(mmHg)" score={scores.map}>{renderInput('map', 'e.g., 90')}</ScoreInputCard>
          <ScoreInputCard icon="❤️" title="Heart Rate" description="per minute" score={scores.hr}>{renderInput('hr', 'e.g., 80')}</ScoreInputCard>
          <ScoreInputCard icon="🫁" title="Respiratory Rate" description="per minute" score={scores.rr}>{renderInput('rr', 'e.g., 16')}</ScoreInputCard>

          <ScoreInputCard icon="💨" title="Oxygenation" description="A-aDO₂ or PaO₂" score={scores.oxygenation}>
            {renderInput('fio2', 'FiO₂ (e.g., 0.4)')}
            <View style={{height: 8}} />
            {renderInput('oxygenationValue', parseFloat(formData.fio2) >= 0.5 ? 'A-aDO₂ (mmHg)' : 'PaO₂ (mmHg)')}
            <Text style={styles.helperText}>* Enter PaO₂ if FiO₂ &lt; 0.5, otherwise enter A-aDO₂.</Text>
          </ScoreInputCard>

          <ScoreInputCard icon="🧪" title="Arterial pH / HCO₃" description="Acid-Base Balance" score={scores.acidBase}>
            <View style={styles.chipContainer}>
                <TouchableOpacity style={[styles.chip, formData.acidBaseMode === 'ph' && styles.chipSelected]} onPress={() => setFormData(p => ({...p, acidBaseMode: 'ph'}))}><Text style={[styles.chipText, formData.acidBaseMode === 'ph' && styles.chipTextSelected]}>Arterial pH</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.chip, formData.acidBaseMode === 'hco3' && styles.chipSelected]} onPress={() => setFormData(p => ({...p, acidBaseMode: 'hco3'}))}><Text style={[styles.chipText, formData.acidBaseMode === 'hco3' && styles.chipTextSelected]}>Serum HCO₃</Text></TouchableOpacity>
            </View>
            {renderInput('acidBaseValue', formData.acidBaseMode === 'ph' ? 'pH value' : 'mEq/L')}
          </ScoreInputCard>

          <ScoreInputCard icon="🧂" title="Serum Sodium" description="mEq/L" score={scores.sodium}>{renderInput('sodium', 'e.g., 140')}</ScoreInputCard>
          <ScoreInputCard icon="🍌" title="Serum Potassium" description="mEq/L" score={scores.potassium}>{renderInput('potassium', 'e.g., 4.0')}</ScoreInputCard>

          <ScoreInputCard icon="🧪" title="Serum Creatinine" description="mg/dL" score={scores.creatinine}>
            {renderInput('creatinine', 'e.g., 1.1')}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Acute Renal Failure?</Text>
              <Switch trackColor={{ false: "#E9E9EA", true: "#B2DFD5" }} thumbColor={formData.isArf ? "#0B6258" : "#f4f3f4"} onValueChange={v => setFormData(p => ({ ...p, isArf: v }))} value={formData.isArf} />
            </View>
          </ScoreInputCard>

          <ScoreInputCard icon="🩸" title="Hematocrit" description="(%)" score={scores.hematocrit}>{renderInput('hematocrit', 'e.g., 45')}</ScoreInputCard>
          <ScoreInputCard icon="🦠" title="White Blood Count" description="x1000/mm³" score={scores.wbc}>{renderInput('wbc', 'e.g., 8.0')}</ScoreInputCard>
          <ScoreInputCard icon="🧠" title="Glasgow Coma Score" description="15 - GCS Score" score={scores.gcs}>{renderInput('gcs', '3-15')}</ScoreInputCard>
          
          <ScoreInputCard icon="🎂" title="Age Points" description="Patient's age in years" score={scores.age}>{renderInput('age', 'e.g., 55')}</ScoreInputCard>

          <ScoreInputCard icon="⚕️" title="Chronic Health Points" description="Underlying health status" score={scores.chronicHealth}>
             <View style={styles.optionsGrid}>
                <TouchableOpacity style={[styles.optionChip, formData.chronicHealthStatus === 'none' && styles.selectedOptionChip]} onPress={() => setFormData(p => ({ ...p, chronicHealthStatus: 'none' }))}><Text style={[styles.optionChipText, formData.chronicHealthStatus === 'none' && styles.selectedOptionChipText]}>None</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.optionChip, formData.chronicHealthStatus === 'elective_post_op' && styles.selectedOptionChip]} onPress={() => setFormData(p => ({ ...p, chronicHealthStatus: 'elective_post_op' }))}><Text style={[styles.optionChipText, formData.chronicHealthStatus === 'elective_post_op' && styles.selectedOptionChipText]}>Elective Post-Op</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.optionChipFull, formData.chronicHealthStatus === 'non_op_or_emergency' && styles.selectedOptionChip]} onPress={() => setFormData(p => ({ ...p, chronicHealthStatus: 'non_op_or_emergency' }))}><Text style={[styles.optionChipText, formData.chronicHealthStatus === 'non_op_or_emergency' && styles.selectedOptionChipText]}>Non-operative or Emergency Post-op</Text></TouchableOpacity>
            </View>
          </ScoreInputCard>

        </ScrollView>
        <Animatable.View animation="slideInUp" duration={500}>
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]} onPress={handleNext} disabled={!isFormValid}>
                    <Text style={styles.nextButtonText}>ต่อไป (Next)</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  container: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#F4F7F6' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
  backButtonText: { fontSize: 24, color: '#0B6258', fontWeight: 'bold' },
  headerTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 22, color: '#0B6258' },
  totalScoreCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0B6258', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#0B6258', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  totalScoreLabel: { fontFamily: 'IBMPlexSans-Regular', fontSize: 12, color: '#FFFFFF', opacity: 0.8 },
  totalScoreValue: { fontFamily: 'IBMPlexSans-Bold', fontSize: 22, color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F4F8' },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardTitle: { fontFamily: 'IBMPlexSans-Bold', fontSize: 17, color: '#2C3E50' },
  cardDescription: { fontFamily: 'IBMPlexSans-Regular', fontSize: 13, color: '#7F8C8D' },
  scoreBadge: { marginLeft: 'auto', width: 36, height: 36, borderRadius: 18, backgroundColor: '#EAF7F5', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#B2DFD5' },
  scoreBadgeText: { color: '#0B6258', fontSize: 16, fontFamily: 'IBMPlexSans-Bold' },
  cardBody: { padding: 16 },
  input: { backgroundColor: '#F4F7F6', borderRadius: 10, borderWidth: 1, borderColor: '#E0E6EB', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, fontFamily: 'IBMPlexSans-Regular', color: '#2C3E50' },
  helperText: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 12, color: '#7F8C8D', marginTop: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  switchLabel: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 15, color: '#2C3E50' },
  chipContainer: { flexDirection: 'row', marginBottom: 12, justifyContent: 'center', gap: 10 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#E0E6EB', backgroundColor: '#F4F7F6', alignItems: 'center' },
  chipSelected: { backgroundColor: '#0B6258', borderColor: '#0B6258' },
  chipText: { color: '#2C3E50', fontFamily: 'IBMPlexSansThai-Regular', fontSize: 14 },
  chipTextSelected: { color: '#FFFFFF', fontFamily: 'IBMPlexSansThai-SemiBold' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  optionChip: { width: '48%', paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E6EB', backgroundColor: '#F4F7F6', alignItems: 'center', marginBottom: 8 },
  optionChipFull: { width: '100%', paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E6EB', backgroundColor: '#F4F7F6', alignItems: 'center', marginBottom: 8 },
  selectedOptionChip: { backgroundColor: '#0B6258', borderColor: '#0B6258' },
  optionChipText: { color: '#2C3E50', fontFamily: 'IBMPlexSansThai-Regular', fontSize: 13, textAlign: 'center' },
  selectedOptionChipText: { color: '#FFFFFF', fontFamily: 'IBMPlexSansThai-SemiBold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E6EB' },
  nextButton: { backgroundColor: '#0B6258', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#0B6258', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  nextButtonDisabled: { backgroundColor: '#B2DFD5', elevation: 0 },
  nextButtonText: { color: 'white', fontSize: 18, fontFamily: 'IBMPlexSansThai-Bold' },
});

export default PatientAPACHEScreen;