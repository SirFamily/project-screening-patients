import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const nursingGuidelines = {
  '1-4': { general: ['Screen and identify critical patients', 'Assess V/S every 1 hour', 'Resuscitation equipment and defibrillator ready', 'Experienced nurses or nurses with critical care training', 'Use REH scoring for every shift', 'Report to physician if changes or GCS drops by ≥2 points', 'Use ISBAR for case reporting'], icu_case_note: 'If ICU case, consider transferring patient to general ward/semi-ICU as first priority.' },
  '5-6': { general: ['Screen and identify critical patients, transfer to semi-critical zone', 'Assess V/S every 1 hour', 'Resuscitation equipment and defibrillator ready', 'Experienced nurses or nurses with critical care training', 'Use REH scoring for every shift', 'Report to physician if changes or GCS drops by ≥2 points', 'Use ISBAR for case reporting'], icu_case_note: 'If ICU case, consider transferring patient to general ward/semi-ICU as second priority.' },
  '7_no_icu': ['Screen and identify critical patients, transfer to critical zone near nursing counter', 'Assess V/S every 1 hour', 'Resuscitation equipment and defibrillator ready', 'Experienced nurses or nurses with critical care training', 'Use REH scoring for every shift', 'Report to physician if changes or GCS drops by ≥2 points', 'Use ISBAR for case reporting', 'Consider daily ICU bed reservation'],
  '7_with_icu': ['Provide care according to ICU standards'],
};

const EvaluationResultScreen = () => {
  const { patientData, resetPatientData } = usePatientContext();
  const navigation = useNavigation();
  const {
    info, assessment, results
  } = patientData;

  const handleNewPatient = () => {
    if (resetPatientData) resetPatientData();
    navigation.navigate('PatientInfo');
  };

  const getRiskStyle = (level) => {
    if (level.includes('เข้า ICU')) return { container: styles.riskHigh, text: styles.riskHighText };
    if (level.includes('ขอเตียง ICU')) return { container: styles.riskMedium, text: styles.riskMediumText };
    return { container: styles.riskLow, text: styles.riskLowText };
  };

  const riskStyle = getRiskStyle(results.riskLevel || '');

  const guidelines = useMemo(() => {
    if (results.totalRehScore >= 7) {
      return info.ward === 'ICU' ? nursingGuidelines['7_with_icu'] : nursingGuidelines['7_no_icu'];
    }
    if (results.totalRehScore >= 5) return nursingGuidelines['5-6'].general;
    return nursingGuidelines['1-4'].general;
  }, [results.totalRehScore, info.ward]);

  const icuCaseNote = useMemo(() => {
    if (info.ward === 'ICU') {
      if (results.totalRehScore >= 5 && results.totalRehScore <= 6) return nursingGuidelines['5-6'].icu_case_note;
      if (results.totalRehScore >= 1 && results.totalRehScore <= 4) return nursingGuidelines['1-4'].icu_case_note;
    }
    return null;
  }, [results.totalRehScore, info.ward]);

  const ScoreDisplay = ({ label, value, isTotal = false }) => (
    <View style={isTotal ? styles.totalScoreCard : styles.scoreItem}>
      <Text style={isTotal ? styles.totalScoreLabel : styles.scoreLabel}>{label}</Text>
      <Text style={isTotal ? styles.totalScoreValue : styles.scoreValue}>{value ?? 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ผลการประเมิน</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
            <Text style={styles.cardTitle}>ข้อมูลผู้ป่วย</Text>
            <View style={styles.patientInfoContainer}>
                <Text style={styles.patientName}>{info.firstName} {info.lastName}</Text>
                <Text style={styles.patientDetail}>HN: {info.hn} | Ward: {info.ward}</Text>
            </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={500} delay={100}>
            <ScoreDisplay label="Total REH Score" value={results.totalRehScore} isTotal />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={500} delay={200} style={[styles.card, riskStyle.container]}>
            <Text style={styles.cardTitle}>ผลการประเมินความเสี่ยง</Text>
            <Text style={[styles.riskText, riskStyle.text]}>{results.riskLevel}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={500} delay={300} style={styles.card}>
            <Text style={styles.cardTitle}>รายละเอียดคะแนน</Text>
            <View style={styles.scoresGrid}>
                <ScoreDisplay label={`${assessment.type} Score`} value={assessment.type === 'SOFA' ? results.sofaScore : results.apacheScore} />
                <ScoreDisplay label="Priority REH" value={results.priorityRehScore} />
                <ScoreDisplay label="CCI Score" value={results.cciScore} />
                <ScoreDisplay label="CCI REH" value={results.cciRehScore} />
            </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={500} delay={400} style={styles.card}>
            <Text style={styles.cardTitle}>แนวทางการดูแล</Text>
            {guidelines.map((item, index) => (
              <Text key={index} style={styles.guidelineItem}>• {item}</Text>
            ))}
            {icuCaseNote && <Text style={styles.icuCaseNote}>*** {icuCaseNote}</Text>}
        </Animatable.View>

      </ScrollView>
      <Animatable.View animation="slideInUp" duration={500} style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNewPatient}>
          <Text style={styles.nextButtonText}>ประเมินผู้ป่วยรายใหม่</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  container: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 },
  header: { paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 24, color: '#0B6258' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 18, color: '#2C3E50', marginBottom: 12 },
  patientInfoContainer: { alignItems: 'center', paddingVertical: 10 },
  patientName: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 22, color: '#0B6258' },
  patientDetail: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 16, color: '#7F8C8D', marginTop: 4 },
  totalScoreCard: { alignItems: 'center', padding: 20, backgroundColor: '#0B6258', borderRadius: 16, marginBottom: 16 },
  totalScoreLabel: { fontFamily: 'IBMPlexSans-Bold', fontSize: 20, color: '#FFFFFF', opacity: 0.9 },
  totalScoreValue: { fontFamily: 'IBMPlexSans-Bold', fontSize: 48, color: '#FFFFFF', marginTop: 4 },
  riskHigh: { backgroundColor: '#FBE9E7', borderColor: '#D32F2F', borderWidth: 1 },
  riskHighText: { color: '#D32F2F' },
  riskMedium: { backgroundColor: '#FFF3E0', borderColor: '#F57C00', borderWidth: 1 },
  riskMediumText: { color: '#F57C00' },
  riskLow: { backgroundColor: '#E8F5E9', borderColor: '#388E3C', borderWidth: 1 },
  riskLowText: { color: '#388E3C' },
  riskText: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 18, textAlign: 'center' },
  scoresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  scoreItem: { backgroundColor: '#F4F7F6', width: '48%', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  scoreLabel: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 14, color: '#7F8C8D' },
  scoreValue: { fontFamily: 'IBMPlexSans-Bold', fontSize: 24, color: '#0B6258', marginTop: 4 },
  guidelineItem: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 15, color: '#2C3E50', marginBottom: 8, lineHeight: 22 },
  icuCaseNote: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 15, color: '#D32F2F', marginTop: 12, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E6EB' },
  nextButton: { backgroundColor: '#0B6258', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#0B6258', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  nextButtonText: { color: 'white', fontSize: 18, fontFamily: 'IBMPlexSansThai-Bold' },
});

export default EvaluationResultScreen;
