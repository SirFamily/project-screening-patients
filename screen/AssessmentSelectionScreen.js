// src/screens/AssessmentSelectionScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const AssessmentSelectionScreen = () => {
  const { updatePatientData } = usePatientContext();
  const navigation = useNavigation();

  const handleSelectAssessment = (type) => {
    updatePatientData({ assessmentType: type });
    navigation.navigate('PatientAssessment');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.stepIndicator}>
          <View style={[styles.step, styles.activeStep]}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <View style={[styles.step, styles.activeStep]}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepText}>3</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepText}>4</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepText}>5</Text>
          </View>
        </View> */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>📋 เลือกแบบประเมิน</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ กรุณาเลือกแบบประเมินที่ต้องการใช้ในการประเมินผู้ป่วย</Text>
            </View>

            <View style={styles.assessmentOptions}>
              <TouchableOpacity 
                style={styles.assessmentCard}
                onPress={() => handleSelectAssessment('SOFA')}
              >
                <Text style={styles.assessmentIcon}>🫁</Text>
                <Text style={styles.assessmentTitle}>SOFA Score</Text>
                <Text style={styles.assessmentDescription}>
                  ประเมิน 6 ระบบร่างกาย: ระบบหายใจ, เกล็ดเลือด, ตับ, ระบบไหลเวียนโลหิต, ระบบประสาท, ไต
                </Text>
                <Text style={styles.selectButton}>เลือก SOFA</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.assessmentCard}
                onPress={() => handleSelectAssessment('APACHE')}
              >
                <Text style={styles.assessmentIcon}>❤️</Text>
                <Text style={styles.assessmentTitle}>APACHE II Score</Text>
                <Text style={styles.assessmentDescription}>
                  ประเมิน 12 ตัวแปรทางสรีรวิทยา: อุณหภูมิ, ความดันโลหิต, อัตราการเต้นหัวใจ, การหายใจ ฯลฯ
                </Text>
                <Text style={styles.selectButton}>เลือก APACHE II</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>← ย้อนกลับ</Text>
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
    backgroundColor: '#eafaf7', // เปลี่ยนพื้นหลังให้สว่างและสะอาดตา
    padding: 20,
    paddingBottom: 60,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 28,
    alignItems: 'center',
  },
  step: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#b2dfd5', // สีหลักอ่อน
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeStep: {
    backgroundColor: '#0b6258', // สีหลัก
  },
  stepText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#0b6258',
  },
  card: {
    backgroundColor: '#fff',
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
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 24,
  },
  infoBox: {
    backgroundColor: '#eafaf7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0b6258',
  },
  infoText: {
    color: '#0b6258',
    fontSize: 16,
    fontWeight: '500',
  },
  assessmentOptions: {
    marginTop: 10,
  },
  assessmentCard: {
    backgroundColor: '#f6fffd',
    borderRadius: 14,
    padding: 22,
    marginBottom: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#b2dfd5',
    elevation: 2,
  },
  assessmentIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  assessmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b6258',
    marginBottom: 8,
  },
  assessmentDescription: {
    color: '#0b6258',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.8,
    fontSize: 15,
  },
  selectButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: '#0b6258',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 32,
    overflow: 'hidden',
    marginTop: 5,
    elevation: 1,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#b2dfd5',
  },
  backButtonText: {
    color: '#0b6258',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AssessmentSelectionScreen;