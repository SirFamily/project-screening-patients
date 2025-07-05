import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

// Scoring Functions (no changes needed here)
const getRespirationScore = (v, isVentilated) => {
  const val = parseFloat(v);
  if (isNaN(val)) return 0;
  if (isVentilated) {
    if (val < 100) return 4;
    if (val < 200) return 3;
  }
  if (val < 300) return 2;
  if (val < 400) return 1;
  return 0;
};
const getPlateletScore = (v) => {
  const val = parseFloat(v);
  if (isNaN(val)) return 0;
  if (val < 20) return 4;
  if (val < 50) return 3;
  if (val < 100) return 2;
  if (val < 150) return 1;
  return 0;
};
const getBilirubinScore = (v) => {
  const val = parseFloat(v);
  if (isNaN(val)) return 0;
  if (val >= 12.0) return 4;
  if (val >= 6.0) return 3;
  if (val >= 2.0) return 2;
  if (val >= 1.2) return 1;
  return 0;
};
const getCnsScore = (v) => {
  const val = parseInt(v, 10);
  if (isNaN(val)) return 0;
  if (val < 6) return 4;
  if (val < 10) return 3;
  if (val < 13) return 2;
  if (val < 15) return 1;
  return 0;
};
const getRenalScore = (v) => {
  const val = parseFloat(v);
  if (isNaN(val)) return 0;
  if (val >= 5.0) return 4;
  if (val >= 3.5) return 3;
  if (val >= 2.0) return 2;
  if (val >= 1.2) return 1;
  return 0;
};

const cardiovascularOptions = [
    { label: 'MAP ≥ 70', value: '0' },
    { label: 'MAP < 70', value: '1' },
    { label: 'Dopamine ≤ 5', value: '2' },
    { label: 'Dopamine > 5', value: '3' },
    { label: 'Dopamine > 15', value: '4' },
];

const ScoreInputCard = ({ icon, title, description, value, onChangeText, placeholder, score, children }) => (
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
    <View style={styles.cardBody}>
      {children ? children : (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholderTextColor="#9DA8B7"
        />
      )}
    </View>
  </Animatable.View>
);

const PatientSOFAScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    respiration: '', isVentilated: false, platelets: '',
    bilirubin: '', cardiovascular: '', cns: '', renal: '',
  });

  const scores = useMemo(() => ({
    respiration: getRespirationScore(formData.respiration, formData.isVentilated),
    platelets: getPlateletScore(formData.platelets),
    bilirubin: getBilirubinScore(formData.bilirubin),
    cardiovascular: parseInt(formData.cardiovascular || '0', 10),
    cns: getCnsScore(formData.cns),
    renal: getRenalScore(formData.renal),
  }), [formData]);

  const totalSofaScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const handleNext = () => {
    updatePatientData({
      assessment: { ...patientData.assessment, sofaValues: formData },
      results: { ...patientData.results, sofaScore: totalSofaScore },
    });
    navigation.navigate('PatientPriority');
  };

  const isFormValid = Object.values(formData).every(val => val !== '' && val !== null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SOFA Score</Text>
        <View style={styles.totalScoreCircle}>
            <Text style={styles.totalScoreLabel}>Total</Text>
            <Text style={styles.totalScoreValue}>{totalSofaScore}</Text>
        </View>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>

          <ScoreInputCard icon="🫁" title="Respiration" description="PaO₂/FiO₂ ratio" score={scores.respiration}>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 350"
                    value={formData.respiration}
                    onChangeText={text => setFormData({ ...formData, respiration: text })}
                    keyboardType="numeric"
                    placeholderTextColor="#9DA8B7"
                />
                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>On mechanical ventilation?</Text>
                    <Switch
                        trackColor={{ false: "#E9E9EA", true: "#B2DFD5" }}
                        thumbColor={formData.isVentilated ? "#0B6258" : "#f4f3f4"}
                        onValueChange={() => setFormData(prev => ({ ...prev, isVentilated: !prev.isVentilated }))}
                        value={formData.isVentilated}
                    />
                </View>
            </View>
          </ScoreInputCard>

          <ScoreInputCard icon="🩸" title="Coagulation" description="Platelets x10³/μL" value={formData.platelets} onChangeText={text => setFormData({ ...formData, platelets: text })} placeholder="e.g., 150" score={scores.platelets} />

          <ScoreInputCard icon="🟤" title="Liver" description="Bilirubin mg/dL" value={formData.bilirubin} onChangeText={text => setFormData({ ...formData, bilirubin: text })} placeholder="e.g., 1.0" score={scores.bilirubin} />

          <ScoreInputCard icon="❤️" title="Cardiovascular" description="Hypotension / Vasopressors" score={scores.cardiovascular}>
            <View style={styles.optionsGrid}>
                {cardiovascularOptions.map(opt => (
                    <TouchableOpacity key={opt.value} style={[styles.optionChip, formData.cardiovascular === opt.value && styles.selectedOptionChip]} onPress={() => setFormData({ ...formData, cardiovascular: opt.value })}>
                        <Text style={[styles.optionChipText, formData.cardiovascular === opt.value && styles.selectedOptionChipText]}>{opt.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
          </ScoreInputCard>

          <ScoreInputCard icon="🧠" title="Central Nervous System" description="Glasgow Coma Scale (GCS)" value={formData.cns} onChangeText={text => setFormData({ ...formData, cns: text })} placeholder="3-15" score={scores.cns} />

          <ScoreInputCard icon="🟡" title="Renal" description="Creatinine mg/dL" value={formData.renal} onChangeText={text => setFormData({ ...formData, renal: text })} placeholder="e.g., 1.1" score={scores.renal} />

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F4F7F6',
  },
  backButton: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
    elevation: 3,
  },
  backButtonText: { fontSize: 24, color: '#0B6258', fontWeight: 'bold' },
  headerTitle: {
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 22,
    color: '#0B6258',
  },
  totalScoreCircle: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: '#0B6258',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#0B6258',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 4,
  },
  totalScoreLabel: { fontFamily: 'IBMPlexSans-Regular', fontSize: 12, color: '#FFFFFF', opacity: 0.8 },
  totalScoreValue: { fontFamily: 'IBMPlexSans-Bold', fontSize: 22, color: '#FFFFFF' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardTitle: { fontFamily: 'IBMPlexSans-Bold', fontSize: 17, color: '#2C3E50' },
  cardDescription: { fontFamily: 'IBMPlexSans-Regular', fontSize: 13, color: '#7F8C8D' },
  scoreBadge: {
    marginLeft: 'auto',
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF7F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#B2DFD5',
  },
  scoreBadgeText: { color: '#0B6258', fontSize: 16, fontFamily: 'IBMPlexSans-Bold' },
  cardBody: { padding: 16 },
  input: {
    backgroundColor: '#F4F7F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E6EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    color: '#2C3E50',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  switchLabel: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 15, color: '#2C3E50' },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionChip: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E6EB',
    backgroundColor: '#F4F7F6',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedOptionChip: { backgroundColor: '#0B6258', borderColor: '#0B6258' },
  optionChipText: { color: '#2C3E50', fontFamily: 'IBMPlexSansThai-Regular', fontSize: 13 },
  selectedOptionChipText: { color: '#FFFFFF', fontFamily: 'IBMPlexSansThai-SemiBold' },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
    paddingBottom: 30, // For safe area
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E6EB',
  },
  nextButton: {
    backgroundColor: '#0B6258',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0B6258',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: { backgroundColor: '#B2DFD5', elevation: 0 },
  nextButtonText: { color: 'white', fontSize: 18, fontFamily: 'IBMPlexSansThai-Bold' },
});

export default PatientSOFAScreen;
