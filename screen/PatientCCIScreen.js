import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const PatientCCIScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();

  const initialComorbidities = {
    ihd: false, chf: false, pad: false, stroke: false, dementia: false, cld: false, cntd: false, pud: false, lsd: false, dm: false, htn: false, warfarin: false, // Score 1
    paralysis: false, dm_comp: false, ckd: false, cancer_non_meta: false, pressure_ulcer: false, // Score 2
    lscd: false, // Score 3
    cancer_meta: false, pcnr: false, // Score 6
  };

  const [comorbidities, setComorbidities] = useState(initialComorbidities);

  const toggleSwitch = (key) => {
    setComorbidities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateCciScore = () => {
    let score = 0;
    // Score 1
    if (comorbidities.ihd || comorbidities.chf || comorbidities.pad || comorbidities.stroke || comorbidities.dementia || comorbidities.cld || comorbidities.cntd || comorbidities.pud || comorbidities.lsd || comorbidities.dm || comorbidities.htn || comorbidities.warfarin) score += 1;
    // Score 2
    if (comorbidities.paralysis || comorbidities.dm_comp || comorbidities.ckd || comorbidities.cancer_non_meta || comorbidities.pressure_ulcer) score += 2;
    // Score 3
    if (comorbidities.lscd) score += 3;
    // Score 6
    if (comorbidities.cancer_meta || comorbidities.pcnr) score += 6;
    return score;
  };

  const getCciRehScore = (cciScore) => {
    if (cciScore <= 2) return 2;
    if (cciScore <= 4) return 1;
    return 0; // > 4
  };

  const getAssessmentRehScore = () => {
    const { assessment, results } = patientData;
    if (assessment.type === 'SOFA') {
        if (results.sofaScore <= 6) return 2;
        if (results.sofaScore <= 9) return 3;
        if (results.sofaScore <= 12) return 4;
        if (results.sofaScore <= 15) return 2;
        return 0; // > 15
    } else { // APACHE II
        if (results.apacheScore <= 9) return 2;
        if (results.apacheScore <= 14) return 3;
        if (results.apacheScore <= 19) return 4;
        if (results.apacheScore <= 24) return 2;
        return 0; // > 24
    }
  };

  const handleCalculate = () => {
    const cciScore = calculateCciScore();
    const cciRehScore = getCciRehScore(cciScore);
    const assessmentRehScore = getAssessmentRehScore();
    const priorityRehScore = patientData.priority.rehScore || 0;

    const totalRehScore = cciRehScore + assessmentRehScore + priorityRehScore;

    let riskLevel = "";
    if (totalRehScore >= 7) riskLevel = "รายงานแพทย์พิจารณาขอเข้า ICU";
    else if (totalRehScore >= 5) riskLevel = "รายงานแพทย์พิจารณาขอเตียง ICU";
    else riskLevel = "รายงานแพทย์พิจารณาขอเตียง ICU"; // 1-4

    updatePatientData({
      cci: { comorbidities },
      results: {
        ...patientData.results,
        cciScore,
        cciRehScore,
        assessmentRehScore, // Make sure this is passed
        priorityRehScore, // Make sure this is passed
        totalRehScore,
        riskLevel,
      },
    });

    navigation.navigate('EvaluationResult');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderSwitch = (label, key) => (
    <View style={styles.switchRow} key={key}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        onValueChange={() => toggleSwitch(key)}
        value={comorbidities[key]}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={comorbidities[key] ? "#0b6258" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>🩺 ประเมิน CCI</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ กรุณาเลือกโรคประจำตัวทั้งหมดของผู้ป่วย</Text>
            </View>

            <Text style={styles.sectionTitle}>กลุ่มคะแนน 1</Text>
            {renderSwitch('โรคกล้ามเนื้อหัวใจตาย (IHD)', 'ihd')}
            {renderSwitch('ภาวะหัวใจล้มเหลว (CHF)', 'chf')}
            {renderSwitch('โรคหลอดเลือดส่วนปลาย (PAD)', 'pad')}
            {renderSwitch('โรคหลอดเลือดสมอง (Stroke)', 'stroke')}
            {renderSwitch('โรคความจำเสื่อม (Dementia)', 'dementia')}
            {renderSwitch('โรคปอดเรื้อรัง', 'cld')}
            {renderSwitch('โรคของเนื้อเยื่อเกี่ยวพัน (CNT disease)', 'cntd')}
            {renderSwitch('โรคแผลในกระเพาะอาหาร', 'pud')}
            {renderSwitch('โรคตับชนิดไม่รุนแรง (CTP A)', 'lsd')}
            {renderSwitch('โรคเบาหวาน', 'dm')}
            {renderSwitch('โรคความดันโลหิตสูง', 'htn')}
            {renderSwitch('ผู้ป่วยที่ได้รับยา Warfarin', 'warfarin')}

            <Text style={styles.sectionTitle}>กลุ่มคะแนน 2</Text>
            {renderSwitch('โรคอัมพาต', 'paralysis')}
            {renderSwitch('โรคเบาหวานที่มีภาวะแทรกซ้อน', 'dm_comp')}
            {renderSwitch('โรคไตวายเรื้อรัง (CKD 4-5)', 'ckd')}
            {renderSwitch('มะเร็ง (ยังไม่แพร่กระจาย)', 'cancer_non_meta')}
            {renderSwitch('แผลกดทับ', 'pressure_ulcer')}

            <Text style={styles.sectionTitle}>กลุ่มคะแนน 3</Text>
            {renderSwitch('โรคตับแข็ง (CTP B-C)', 'lscd')}

            <Text style={styles.sectionTitle}>กลุ่มคะแนน 6</Text>
            {renderSwitch('มะเร็งระยะแพร่กระจาย', 'cancer_meta')}
            {renderSwitch('ผู้ป่วย PC/NR/Hopeless', 'pcnr')}

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>← ย้อนกลับ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                <Text style={styles.calculateButtonText}>คำนวณคะแนน</Text>
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
    },
    cardHeaderText: {
        color: 'white',
        fontSize: 19,
        fontWeight: '700',
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
        color: '#0b6258',
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#b2dfd5',
        paddingBottom: 5,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#0b6258',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        gap: 10,
    },
    backButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#0b6258',
        borderRadius: 30,
        paddingVertical: 14,
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
        flex: 1,
        alignItems: 'center',
    },
    calculateButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default PatientCCIScreen;