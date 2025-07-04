
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const EvaluationResultScreen = () => {
  const { patientData } = usePatientContext();
  const navigation = useNavigation();

  const { 
    name, hn, ward, assessmentType, 
    sofaScore, apacheScore, 
    priorityRehScore, 
    cciScore, cciRehScore, 
    totalRehScore, riskLevel
  } = patientData;

  const assessmentScore = assessmentType === 'SOFA' ? sofaScore : apacheScore;

  const handleNewPatient = () => {
    // Optionally clear patient data here
    navigation.navigate('PatientInfo');
  };

  const renderDetail = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value !== undefined && value !== null ? value : 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>📋 ผลการประเมิน</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.sectionTitle}>ข้อมูลผู้ป่วย</Text>
            {renderDetail('ชื่อ-สกุล:', name)}
            {renderDetail('HN:', hn)}
            {renderDetail('วอร์ด:', ward)}

            <Text style={styles.sectionTitle}>ผลคะแนน</Text>
            {renderDetail(`คะแนน ${assessmentType}:`, assessmentScore)}
            {renderDetail('คะแนน Priority (REH):', priorityRehScore)}
            {renderDetail('คะแนน CCI:', cciScore)}
            {renderDetail('คะแนน CCI (REH):', cciRehScore)}

            <View style={styles.totalScoreContainer}>
              <Text style={styles.totalScoreLabel}>คะแนนรวม (REH Score):</Text>
              <Text style={styles.totalScoreValue}>{totalRehScore}</Text>
            </View>

            <View style={styles.riskLevelContainer}>
              <Text style={styles.riskLevelLabel}>ผลการประเมินความเสี่ยง:</Text>
              <Text style={styles.riskLevelValue}>{riskLevel}</Text>
            </View>

            <TouchableOpacity style={styles.newPatientButton} onPress={handleNewPatient}>
              <Text style={styles.newPatientButtonText}>ประเมินผู้ป่วยรายใหม่</Text>
            </TouchableOpacity>
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
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 18,
        elevation: 8,
        shadowColor: '#0b6258',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardHeader: {
        backgroundColor: '#0b6258',
        padding: 20,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    cardHeaderText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardBody: {
        padding: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0b6258',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#b2dfd5',
        paddingBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 5,
    },
    detailLabel: {
        fontSize: 16,
        color: '#333',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0b6258',
    },
    totalScoreContainer: {
        backgroundColor: '#b2dfd5',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    totalScoreLabel: {
        fontSize: 18,
        color: '#0b6258',
        fontWeight: '600',
    },
    totalScoreValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0b6258',
        marginTop: 5,
    },
    riskLevelContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f6fffd',
        borderWidth: 1,
        borderColor: '#0b6258',
    },
    riskLevelLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0b6258',
        textAlign: 'center',
    },
    riskLevelValue: {
        fontSize: 16,
        color: '#D32F2F',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: 'bold',
    },
    newPatientButton: {
        backgroundColor: '#0b6258',
        borderRadius: 30,
        paddingVertical: 15,
        marginTop: 30,
        elevation: 2,
    },
    newPatientButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EvaluationResultScreen;
