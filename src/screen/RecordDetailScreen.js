import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';

// Re-using the same guidelines and styles from EvaluationResultScreen
// In a real app, you might move these to a shared file.
const nursingGuidelines = {
    '1-4': { general: ['คัดกรองและระบุผู้ป่วยวิกฤต', 'ประเมิน V/S ทุก 1 ชั่วโมง', 'มีอุปกรณ์ช่วยฟื้นคืนชีพ monitor เครื่อง defibrillation พร้อมใช้งาน', 'พยาบาลผู้ดูแลมีประสบการณ์หรือผ่านการอบรมวิกฤต', 'ใช้แบบประเมิน REH scoring ทุกเวร', 'รายงานแพทย์เมื่อมีการเปลี่ยนแปลงหรือ GCS ลดลง ≥2 คะแนน', 'ใช้ระบบ ISBAR ในการรายงานเคส'], icu_case_note: '***กรณีcase ICU ให้พิจารณาย้ายผู้ป่วยไป ward semi ICU สามัญคิวแรก' },
    '5-6': { general: ['คัดกรองและระบุผู้ป่วยวิกฤต ย้ายผู้ป่วยไป zone กึ่งผู้ป่วยวิกฤต', 'ประเมิน V/S ทุก 1 ชั่วโมง', 'มีอุปกรณ์ช่วยฟื้นคืนชีพ monitor เครื่อง defibrillation พร้อมใช้งาน', 'พยาบาลผู้ดูแลมีประสบการณ์หรือผ่านการอบรมวิกฤต', 'ใช้แบบประเมิน REH scoring ทุกเวร', 'รายงานแพทย์เมื่อมีการเปลี่ยนแปลงหรือ GCS ลดลง ≥2 คะแนน', 'ใช้ระบบ ISBAR ในการรายงานเคส'], icu_case_note: '***กรณีcase ICU ให้พิจารณาย้ายผู้ป่วยไป ward semi ICU สามัญคิวสอง' },
    '7_no_icu': ['คัดกรองและระบุผู้ป่วยวิกฤต ย้ายผู้ป่วยไป zone ผู้ป่วยวิกฤตใกล้ counter พยาบาล', 'ประเมิน V/S ทุก 1 ชั่วโมง', 'มีอุปกรณ์ช่วยฟื้นคืนชีพ monitor เครื่อง defibrillation พร้อมใช้งาน', 'พยาบาลผู้ดูแลมีประสบการณ์หรือผ่านการอบรมวิกฤต', 'ใช้แบบประเมิน REH scoring ทุกเวร', 'รายงานแพทย์เมื่อมีการเปลี่ยนแปลงหรือ GCS ลดลง ≥2 คะแนน', 'ใช้ระบบ ISBAR ในการรายงานเคส', 'พิจารณาจองเตียง ICU ทุกวัน'],
    '7_with_icu': ['ดูแลตามมาตรฐาน ICU'],
};

const RecordDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  useBackButtonExitHandler();
  const { evaluation, patient } = route.params;

  // Re-structure data to mimic the context structure for UI compatibility
  const patientData = {
      info: { ...patient, ward: evaluation.ward },
      assessment: {
          type: evaluation.assessmentType,
          sofaValues: { respiration: evaluation.sofa_respiration, platelets: evaluation.sofa_platelets, bilirubin: evaluation.sofa_bilirubin, cardiovascular: evaluation.sofa_cardiovascular, cns: evaluation.sofa_cns, renal: evaluation.sofa_renal },
          apacheValues: { temperature: evaluation.apache_temperature, map: evaluation.apache_map, hr: evaluation.apache_hr, rr: evaluation.apache_rr, fio2: evaluation.apache_fio2, oxygenationValue: evaluation.apache_oxygenationValue, acidBaseMode: evaluation.apache_acidBaseMode, acidBaseValue: evaluation.apache_acidBaseValue, sodium: evaluation.apache_sodium, potassium: evaluation.apache_potassium, creatinine: evaluation.apache_creatinine, isArf: evaluation.apache_isArf, hematocrit: evaluation.apache_hematocrit, wbc: evaluation.apache_wbc, gcs: evaluation.apache_gcs, age: evaluation.apache_age, chronicConditions: evaluation.apache_chronicConditions, surgeryStatus: evaluation.apache_surgeryStatus },
      },
      cci: { comorbidities: evaluation.cci_comorbidities },
      results: {
          sofaScore: evaluation.sofaScore,
          apacheScore: evaluation.apacheScore,
          assessmentRehScore: evaluation.assessmentRehScore,
          priorityRehScore: evaluation.priorityRehScore,
          cciScore: evaluation.cciScore,
          cciRehScore: evaluation.cciRehScore,
          totalRehScore: evaluation.totalRehScore,
          riskLevel: evaluation.riskLevel,
      }
  };

  const { info, assessment, results } = patientData;

  const getRiskStyle = (level) => {
    if (!level) return { container: styles.riskLow, text: styles.riskLowText };
    if (level.includes('เข้า ICU')) return { container: styles.riskHigh, text: styles.riskHighText };
    if (level.includes('ขอเตียง ICU')) return { container: styles.riskMedium, text: styles.riskMediumText };
    return { container: styles.riskLow, text: styles.riskLowText };
  };

  const riskStyle = getRiskStyle(results.riskLevel);

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
            <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ผลการประเมิน</Text>
        <View style={{ width: 40 }} />
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
    </SafeAreaView>
  );
};

// Using the same styles from EvaluationResultScreen
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  container: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  headerTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 24, color: '#0B6258' },
  backButton: { padding: 5 },
  backButtonText: { fontSize: 24, color: '#0B6258', fontWeight: 'bold' },
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
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F4F8' },
  breakdownCategory: { fontFamily: 'IBMPlexSans-Bold', fontSize: 16, color: '#2C3E50' },
  breakdownScores: { flexDirection: 'row', alignItems: 'center' },
  breakdownRaw: { fontFamily: 'IBMPlexSans-Regular', fontSize: 15, color: '#7F8C8D' },
  breakdownArrow: { fontFamily: 'IBMPlexSans-Bold', fontSize: 16, color: '#0B6258', marginHorizontal: 8 },
  breakdownReh: { fontFamily: 'IBMPlexSans-Bold', fontSize: 16, color: '#0B6258', minWidth: 80, textAlign: 'right' },
});

export default RecordDetailScreen;
