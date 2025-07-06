import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import SaveConfirmationModal from '../components/SaveConfirmationModal';
import { saveEvaluation } from '../api/evaluationService';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';


// Translated Nursing Guidelines from PDF
const nursingGuidelines = {
  '1-4': {
    general: [
      'คัดกรองและระบุผู้ป่วยวิกฤต',
      'ประเมิน V/S ทุก 1 ชั่วโมง',
      'มีอุปกรณ์ช่วยฟื้นคืนชีพ monitor เครื่อง defibrillation พร้อมใช้งาน',
      'พยาบาลผู้ดูแลมีประสบการณ์หรือผ่านการอบรมวิกฤต',
      'ใช้แบบประเมิน REH scoring ทุกเวร',
      'รายงานแพทย์เมื่อมีการเปลี่ยนแปลงหรือ GCS ลดลง ≥2 คะแนน',
      'ใช้ระบบ ISBAR ในการรายงานเคส',
    ],
    icu_case_note: '***กรณีcase ICU ให้พิจารณาย้ายผู้ป่วยไป ward semi ICU สามัญคิวแรก'
  },
  '5-6': {
    general: [
      'คัดกรองและระบุผู้ป่วยวิกฤต ย้ายผู้ป่วยไป zone กึ่งผู้ป่วยวิกฤต',
      'ประเมิน V/S ทุก 1 ชั่วโมง',
      'มีอุปกรณ์ช่วยฟื้นคืนชีพ monitor เครื่อง defibrillation พร้อมใช้งาน',
      'พยาบาลผู้ดูแลมีประสบการณ์หรือผ่านการอบรมวิกฤต',
      'ใช้แบบประเมิน REH scoring ทุกเวร',
      'รายงานแพทย์เมื่อมีการเปลี่ยนแปลงหรือ GCS ลดลง ≥2 คะแนน',
      'ใช้ระบบ ISBAR ในการรายงานเคส',
    ],
    icu_case_note: '***กรณีcase ICU ให้พิจารณาย้ายผู้ป่วยไป ward semi ICU สามัญคิวสอง'
  },
  '7_no_icu': [
    'คัดกรองและระบุผู้ป่วยวิกฤต ย้ายผู้ป่วยไป zone ผู้ป่วยวิกฤตใกล้ counter พยาบาล',
    'ประเมิน V/S ทุก 1 ชั่วโมง',
    'มีอุปกรณ์ช่วยฟื้นคืนชีพ monitor เครื่อง defibrillation พร้อมใช้งาน',
    'พยาบาลผู้ดูแลมีประสบการณ์หรือผ่านการอบรมวิกฤต',
    'ใช้แบบประเมิน REH scoring ทุกเวร',
    'รายงานแพทย์เมื่อมีการเปลี่ยนแปลงหรือ GCS ลดลง ≥2 คะแนน',
    'ใช้ระบบ ISBAR ในการรายงานเคส',
    'พิจารณาจองเตียง ICU ทุกวัน',
  ],
  '7_with_icu': [
    'ดูแลตามมาตรฐาน ICU',
  ],
};

const EvaluationResultScreen = () => {
  const { patientData, resetPatientData } = usePatientContext();
  const navigation = useNavigation();
  useBackButtonExitHandler();
  const { info, assessment, results } = patientData;
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveEvaluation(patientData);
      Alert.alert('สำเร็จ', 'บันทึกข้อมูลการประเมินเรียบร้อยแล้ว');
      handleResetAndNavigate();
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsSaving(false);
      setModalVisible(false);
    }
  };

  const handleResetAndNavigate = () => {
    if (resetPatientData) resetPatientData();
    navigation.replace('PatientInfo');
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

  const ScoreBreakdownRow = ({ category, rawScore, rehScore }) => (
    <View style={styles.breakdownRow}>
        <Text style={styles.breakdownCategory}>{category}</Text>
        <View style={styles.breakdownScores}>
            <Text style={styles.breakdownRaw}>Score: {rawScore ?? 'N/A'}</Text>
            <Text style={styles.breakdownArrow}>→</Text>
            <Text style={styles.breakdownReh}>REH: {rehScore ?? 'N/A'}</Text>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ผลการประเมิน</Text>
        <View style={styles.placeholderView} />
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
            <View style={styles.totalScoreCard}>
                <Text style={styles.totalScoreLabel}>Total REH Score</Text>
                <Text style={styles.totalScoreValue}>{results.totalRehScore ?? 'N/A'}</Text>
            </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={500} delay={200} style={[styles.card, riskStyle.container]}>
            <Text style={styles.cardTitle}>ผลการประเมินความเสี่ยง</Text>
            <Text style={[styles.riskText, riskStyle.text]}>{results.riskLevel}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={500} delay={300} style={styles.card}>
            <Text style={styles.cardTitle}>รายละเอียดคะแนน</Text>
            <ScoreBreakdownRow category="Priority" rawScore={results.priorityRehScore} rehScore={results.priorityRehScore} />
            <ScoreBreakdownRow category="CCI" rawScore={results.cciScore} rehScore={results.cciRehScore} />
            <ScoreBreakdownRow category={assessment.type} rawScore={assessment.type === 'SOFA' ? results.sofaScore : results.apacheScore} rehScore={results.assessmentRehScore} />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={500} delay={400} style={styles.card}>
            <Text style={styles.cardTitle}>แนวทางการดูแล</Text>
            {guidelines.map((item, index) => (
              <Text key={index} style={styles.guidelineItem}>• {item}</Text>
            ))}
            {icuCaseNote && <Text style={styles.icuCaseNote}>{icuCaseNote}</Text>}
        </Animatable.View>

      </ScrollView>
      <Animatable.View animation="slideInUp" duration={500} style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleOpenModal}>
          <Text style={styles.nextButtonText}>ประเมินผู้ป่วยรายใหม่</Text>
        </TouchableOpacity>
      </Animatable.View>
       <SaveConfirmationModal
        visible={modalVisible}
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={() => {
          handleCloseModal();
          handleResetAndNavigate(); // Reset and navigate back if cancelled
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  container: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#F4F7F6' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
  backButtonText: { fontSize: 24, color: '#0B6258', fontWeight: 'bold' },
  placeholderView: { width: 44, height: 44 },
  headerTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 24, color: '#0B6258' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 18, color: '#2C3E50', marginBottom: 12 },
  patientInfoContainer: { alignItems: 'center', paddingVertical: 10 },
  patientName: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 22, color: '#0B6258' },
  patientDetail: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 16, color: '#7F8C8D', marginTop: 4 },
  totalScoreCard: { alignItems: 'center', padding: 20, backgroundColor: '#0B6258', borderRadius: 16, marginBottom: 16 },
  totalScoreLabel: { fontFamily: 'IBMPlexSans-Bold', fontSize: 20, color: '#FFFFFF', opacity: 0.9 },
  totalScoreValue: { fontFamily: 'IBMPlexSans-Bold', fontSize: 48, color: '#FFFFFF', marginTop: 4 },
  riskHigh: { backgroundColor: '#FBE9E7' },
  riskHighText: { color: '#D32F2F' },
  riskMedium: { backgroundColor: '#FFF3E0' },
  riskMediumText: { color: '#F57C00' },
  riskLow: { backgroundColor: '#E8F5E9' },
  riskLowText: { color: '#388E3C' },
  riskText: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 18, textAlign: 'center' },
  guidelineItem: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 15, color: '#2C3E50', marginBottom: 8, lineHeight: 22 },
  icuCaseNote: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 15, color: '#D32F2F', marginTop: 12, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E6EB' },
  nextButton: { backgroundColor: '#0B6258', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#0B6258', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  nextButtonText: { color: 'white', fontSize: 18, fontFamily: 'IBMPlexSansThai-Bold' },
  // Styles for Score Breakdown
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  breakdownCategory: {
    fontFamily: 'IBMPlexSans-Bold',
    fontSize: 16,
    color: '#2C3E50',
  },
  breakdownScores: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownRaw: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 15,
    color: '#7F8C8D',
  },
  breakdownArrow: {
    fontFamily: 'IBMPlexSans-Bold',
    fontSize: 16,
    color: '#0B6258',
    marginHorizontal: 8,
  },
  breakdownReh: {
    fontFamily: 'IBMPlexSans-Bold',
    fontSize: 16,
    color: '#0B6258',
    minWidth: 80,
    textAlign: 'right',
  },
});

export default EvaluationResultScreen;