import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const priorityOptions = [
  { 
    title: 'Priority 1',
    description: 'วิกฤต, สัญญาณชีพไม่คงที่, ต้องการการดูแลใกล้ชิดใน ICU, โอกาสรอด >50%', 
    value: '4',
    icon: '🔴' 
  },
  { 
    title: 'Priority 2',
    description: 'ต้องการเฝ้าระวังใกล้ชิด (เช่น เสี่ยงต่อภาวะหายใจล้มเหลว)', 
    value: '3',
    icon: '🟠'
  },
  { 
    title: 'Priority 3',
    description: 'วิกฤต, แต่โอกาสหายจากโรคยาก, อวัยวะล้มเหลวหลายระบบ, โอกาสรอด <50%', 
    value: '2',
    icon: '🟡'
  },
  { 
    title: 'Priority 4',
    description: 'อาการคงที่, ไม่จำเป็นต้องอยู่ ICU (เช่น ผู้ป่วยมะเร็งระยะสุดท้าย)', 
    value: '0',
    icon: '🟢'
  },
];

const PatientPriorityScreen = () => {
  const { updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [priority, setPriority] = useState('');

  const handleNext = () => {
    updatePatientData({
        priority: { rehScore: parseInt(priority || 0, 10) }
    });
    navigation.navigate('PatientCCI');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Priority</Text>
        <View style={styles.totalScoreCircle}>
          <Text style={styles.totalScoreLabel}>REH</Text>
          <Text style={styles.totalScoreValue}>{priority || '0'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.Text animation="fadeIn" duration={600} style={styles.screenDescription}>
          กรุณาเลือกระดับความเร่งด่วนของผู้ป่วยตามเกณฑ์ที่กำหนด
        </Animatable.Text>
        
        {priorityOptions.map((option, index) => (
          <Animatable.View key={option.value} animation="fadeInUp" duration={500} delay={index * 100}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                priority === option.value && styles.selectedOptionCard
              ]}
              onPress={() => setPriority(option.value)}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, priority === option.value && styles.selectedOptionText]}>{option.title}</Text>
                <Text style={[styles.optionDescription, priority === option.value && styles.selectedOptionText]}>{option.description}</Text>
              </View>
              <View style={[styles.radioCircle, priority === option.value && styles.radioCircleSelected]}>
                {priority === option.value && <View style={styles.radioInnerCircle} />}
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>

      <Animatable.View animation="slideInUp" duration={500} style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, !priority && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={!priority}
        >
          <Text style={styles.nextButtonText}>ต่อไป (Next)</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  container: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#F4F7F6' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
  backButtonText: { fontSize: 24, color: '#0B6258', fontWeight: 'bold' },
  headerTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 22, color: '#0B6258' },
  totalScoreCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0B6258', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#0B6258', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  totalScoreLabel: { fontFamily: 'IBMPlexSans-Regular', fontSize: 12, color: '#FFFFFF', opacity: 0.8 },
  totalScoreValue: { fontFamily: 'IBMPlexSans-Bold', fontSize: 22, color: '#FFFFFF' },
  screenDescription: {
    fontFamily: 'IBMPlexSansThai-Regular',
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E6EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedOptionCard: {
    borderColor: '#0B6258',
    backgroundColor: '#EAF7F5',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 16,
    color: '#2C3E50',
  },
  optionDescription: {
    fontFamily: 'IBMPlexSansThai-Regular',
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  selectedOptionText: {
    color: '#0B6258',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E6EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  radioCircleSelected: {
    borderColor: '#0B6258',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0B6258',
  },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E6EB' },
  nextButton: { backgroundColor: '#0B6258', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#0B6258', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  nextButtonDisabled: { backgroundColor: '#B2DFD5', elevation: 0 },
  nextButtonText: { color: 'white', fontSize: 18, fontFamily: 'IBMPlexSansThai-Bold' },
});

export default PatientPriorityScreen;