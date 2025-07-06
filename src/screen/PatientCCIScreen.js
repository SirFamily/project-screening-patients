import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Switch, StatusBar, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';

const cciSections = {
  score1: {
    title: 'กลุ่มคะแนน 1',
    icon: '1️⃣',
    items: {
      ihd: 'โรคกล้ามเนื้อหัวใจตาย (IHD)', chf: 'ภาวะหัวใจล้มเหลว (CHF)', pad: 'โรคหลอดเลือดส่วนปลาย (PAD)',
      stroke: 'โรคหลอดเลือดสมอง (Stroke)', dementia: 'โรคความจำเสื่อม (Dementia)', cld: 'โรคปอดเรื้อรัง',
      cntd: 'โรคของเนื้อเยื่อเกี่ยวพัน (CNT disease)', pud: 'โรคแผลในกระเพาะอาหาร', lsd: 'โรคตับชนิดไม่รุนแรง (CTP A)',
      dm: 'โรคเบาหวาน', htn: 'โรคความดันโลหิตสูง', warfarin: 'ผู้ป่วยที่ได้รับยา Warfarin',
    }
  },
  score2: {
    title: 'กลุ่มคะแนน 2',
    icon: '2️⃣',
    items: {
      paralysis: 'โรคอัมพาต', dm_comp: 'โรคเบาหวานที่มีภาวะแทรกซ้อน', ckd: 'โรคไตวายเรื้อรัง (CKD 4-5)',
      cancer_non_meta: 'มะเร็ง (ยังไม่แพร่กระจาย)', pressure_ulcer: 'แผลกดทับ',
    }
  },
  score3: {
    title: 'กลุ่มคะแนน 3',
    icon: '3️⃣',
    items: { lscd: 'โรคตับแข็ง (CTP B-C)' }
  },
  score6: {
    title: 'กลุ่มคะแนน 6',
    icon: '6️⃣',
    items: { cancer_meta: 'มะเร็งระยะแพร่กระจาย', pcnr: 'ผู้ป่วย PC/NR/Hopeless' }
  },
};

const PatientCCIScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  useBackButtonExitHandler();
  const [comorbidities, setComorbidities] = useState({});

  const toggleSwitch = (key) => {
    setComorbidities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { cciScore, cciRehScore } = useMemo(() => {
    let score = 0;
    for (const key in cciSections.score1.items) {
      if (comorbidities[key]) {
        score += 1;
      }
    }
    for (const key in cciSections.score2.items) {
      if (comorbidities[key]) {
        score += 2;
      }
    }
    for (const key in cciSections.score3.items) {
      if (comorbidities[key]) {
        score += 3;
      }
    }
    for (const key in cciSections.score6.items) {
      if (comorbidities[key]) {
        score += 6;
      }
    }
    
    let rehScore = 0;
    if (score <= 2) rehScore = 2;
    else if (score <= 4) rehScore = 1;

    return { cciScore: score, cciRehScore: rehScore };
  }, [comorbidities]);

  const handleCalculate = () => {
    const { assessment, results, priority } = patientData;
    let assessmentRehScore = 0;
    if (assessment.type === 'SOFA') {
        if (results.sofaScore <= 6) assessmentRehScore = 2;
        else if (results.sofaScore <= 9) assessmentRehScore = 3;
        else if (results.sofaScore <= 12) assessmentRehScore = 4;
        else if (results.sofaScore <= 15) assessmentRehScore = 2;
    } else { // APACHE II
        if (results.apacheScore <= 9) assessmentRehScore = 2;
        else if (results.apacheScore <= 14) assessmentRehScore = 3;
        else if (results.apacheScore <= 19) assessmentRehScore = 4;
        else if (results.apacheScore <= 24) assessmentRehScore = 2;
    }

    const priorityRehScore = priority.rehScore || 0;
    const totalRehScore = cciRehScore + assessmentRehScore + priorityRehScore;

    let riskLevel = "";
    if (totalRehScore >= 7) riskLevel = "รายงานแพทย์พิจารณาขอเข้า ICU";
    else if (totalRehScore >= 5) riskLevel = "รายงานแพทย์พิจารณาขอเตียง ICU";
    else riskLevel = "รายงานแพทย์พิจารณาขอเตียง ICU";

    updatePatientData({
      cci: { comorbidities },
      results: { cciScore, cciRehScore, assessmentRehScore, priorityRehScore, totalRehScore, riskLevel },
    });

    navigation.navigate('EvaluationResult');
  };

  const renderSwitch = (label, key) => (
    <View style={styles.switchRow} key={key}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        onValueChange={() => toggleSwitch(key)}
        value={!!comorbidities[key]}
        trackColor={{ false: "#E9E9EA", true: "#B2DFD5" }}
        thumbColor={comorbidities[key] ? "#0B6258" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CCI Score</Text>
        <View style={styles.totalScoreCircle}>
          <Text style={styles.totalScoreLabel}>CCI</Text>
          <Text style={styles.totalScoreValue}>{cciScore}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {Object.values(cciSections).map((section, index) => (
          <Animatable.View key={section.title} animation="fadeInUp" duration={500} delay={index * 100}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{section.icon}</Text>
                <Text style={styles.cardTitle}>{section.title}</Text>
              </View>
              <View style={styles.cardBody}>
                {Object.entries(section.items).map(([key, label]) => renderSwitch(label, key))}
              </View>
            </View>
          </Animatable.View>
        ))}
      </ScrollView>

      <Animatable.View animation="slideInUp" duration={500} style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleCalculate}>
          <Text style={styles.nextButtonText}>ดูผลการประเมิน</Text>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F4F8' },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 17, color: '#2C3E50' },
  cardBody: { paddingHorizontal: 16, paddingBottom: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F4F8' },
  switchRowLast: { borderBottomWidth: 0 },
  switchLabel: { flex: 1, fontFamily: 'IBMPlexSansThai-Regular', fontSize: 15, color: '#2C3E50' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E6EB' },
  nextButton: { backgroundColor: '#0B6258', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#0B6258', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  nextButtonText: { color: 'white', fontSize: 18, fontFamily: 'IBMPlexSansThai-Bold' },
});

export default PatientCCIScreen;
