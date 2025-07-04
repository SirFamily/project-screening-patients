import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const PatientAPACHEScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    apachePhysiology: '',
    apacheAge: '',
    apacheChronic: '',
    apachePhysiology: '',
    apacheAge: '',
    apacheChronic: '',
  });

  const handleNext = () => {
    const apacheScore = 
      parseInt(formData.apachePhysiology || 0) +
      parseInt(formData.apacheAge || 0) +
      parseInt(formData.apacheChronic || 0);

    updatePatientData({
      apacheScore,
    });

    navigation.navigate('PatientPriority');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.stepIndicator}>
          <View style={[styles.step, styles.completedStep]}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <View style={[styles.step, styles.completedStep]}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <View style={[styles.step, styles.activeStep]}>
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
            <Text style={styles.cardHeaderText}>📊 ประเมินคะแนน APACHE II</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ กรุณากรอกข้อมูลเพื่อประเมินคะแนนผู้ป่วย</Text>
            </View>

            <Text style={styles.sectionTitle}>❤️ ประเมิน APACHE II Score</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>คะแนนสรีรวิทยารวม (Acute Physiology Score)</Text>
              <TextInput
                style={styles.input}
                placeholder="0-60"
                keyboardType="numeric"
                value={formData.apachePhysiology}
                onChangeText={text => setFormData({...formData, apachePhysiology: text})}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>คะแนนอายุ (Age Points)</Text>
              <TextInput
                style={styles.input}
                placeholder="0-6"
                keyboardType="numeric"
                value={formData.apacheAge}
                onChangeText={text => setFormData({...formData, apacheAge: text})}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>คะแนนสุขภาพเรื้อรัง (Chronic Health Points)</Text>
              <TextInput
                style={styles.input}
                placeholder="0-5"
                keyboardType="numeric"
                value={formData.apacheChronic}
                onChangeText={text => setFormData({...formData, apacheChronic: text})}
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>← ย้อนกลับ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.calculateButton} 
                onPress={handleNext}
              >
                <Text style={styles.calculateButtonText}>ต่อไป →</Text>
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
    backgroundColor: '#eafaf7', // เปลี่ยนพื้นหลังให้สว่างและสะอาดตา
    padding: 20,
    paddingBottom: 60,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 25,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b2dfd5', // สีอ่อนของ #0b6258
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  completedStep: {
    backgroundColor: '#0b6258',
  },
  activeStep: {
    backgroundColor: '#0b6258',
    borderWidth: 2,
    borderColor: '#fff',
  },
  stepText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
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
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardHeaderText: {
    color: 'white',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    marginBottom: 15,
    color: '#0b6258',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    color: '#0b6258',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#b2dfd5',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    backgroundColor: '#f6fffd',
    color: '#0b6258',
    marginTop: 2,
  },
  optionsContainer: {
    marginTop: 5,
  },
  optionButton: {
    padding: 13,
    borderWidth: 1.5,
    borderColor: '#b2dfd5',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f6fffd',
  },
  selectedOption: {
    backgroundColor: '#0b6258',
    borderColor: '#0b6258',
  },
  optionText: {
    color: '#0b6258',
    fontWeight: '500',
    fontSize: 15,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#0b6258',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
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
    paddingHorizontal: 36,
    flex: 1,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PatientAPACHEScreen;