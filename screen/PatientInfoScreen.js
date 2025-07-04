// src/screens/PatientInfoScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';

const PatientInfoScreen = () => {
  const { updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    ward: '',
    firstName: '',
    lastName: '',
    hn: ''
  });

  const wards = [
    { label: 'ห้องฉุกเฉิน (Accident and Emergency)', value: 'AE' },
    { label: 'วอร์ดผู้ป่วยทั่วไป (Ward)', value: 'ward' },
    { label: 'หอผู้ป่วยหนัก (ICU)', value: 'ICU' },
  ];

  const handleNext = () => {
    updatePatientData({
      info: {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`
      }
    });
    navigation.navigate('AssessmentSelection');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eafaf7' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // ปรับ offset ตาม header หรือ status bar
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>❤️</Text>
            </View>
            <Text style={styles.title}>แอปพลิเคชันแนวปฏิบัติการพยาบาล</Text>
            <Text style={styles.subtitle}>โรงพยาบาลร้อยเอ็ด • คัดกรองและดูแลผู้ป่วยวิกฤต</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>👤 ข้อมูลผู้ป่วย</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.label}>เลือกวอร์ด/พื้นที่รักษา</Text>
              <View style={styles.selectContainer}>
                {wards.map((ward, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      formData.ward === ward.value && styles.selectedOption
                    ]}
                    onPress={() => setFormData({ ...formData, ward: ward.value })}
                  >
                    <Text style={formData.ward === ward.value ? styles.selectedOptionText : styles.optionText}>
                      {ward.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ชื่อ</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ชื่อ"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                    placeholderTextColor="#b2b2b2"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>นามสกุล</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="นามสกุล"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                    placeholderTextColor="#b2b2b2"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>หมายเลข HN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="หมายเลข HN"
                  value={formData.hn}
                  onChangeText={(text) => setFormData({ ...formData, hn: text })}
                  keyboardType="numeric"
                  placeholderTextColor="#b2b2b2"
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.nextButton, 
                  (!formData.ward || !formData.firstName || !formData.lastName || !formData.hn) && styles.nextButtonDisabled
                ]} 
                onPress={handleNext}
                disabled={!formData.ward || !formData.firstName || !formData.lastName || !formData.hn}
              >
                <Text style={styles.nextButtonText}>ต่อไป →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    backgroundColor: '#fff',
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#0b6258',
  },
  logoIcon: {
    fontSize: 36,
    color: '#0b6258',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0b6258',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#0b6258',
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    elevation: 5,
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
  label: {
    marginBottom: 8,
    fontSize: 15,
    color: '#0b6258',
    fontWeight: '600',
  },
  selectContainer: {
    marginBottom: 22,
  },
  option: {
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
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 22,
    gap: 10,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 2,
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
  nextButton: {
    backgroundColor: '#0b6258',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignSelf: 'center',
    marginTop: 10,
    elevation: 2,
  },
  nextButtonDisabled: {
    backgroundColor: '#b2dfd5',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PatientInfoScreen;