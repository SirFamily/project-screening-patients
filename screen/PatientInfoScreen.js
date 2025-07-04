import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

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
    { label: 'ห้องฉุกเฉิน (Emergency)', value: 'AE' },
    { label: 'วอร์ดผู้ป่วยทั่วไป (General Ward)', value: 'ward' },
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

  const isFormValid = formData.ward && formData.firstName && formData.lastName && formData.hn;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4F8" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>🏥</Text>
            </View>
            <Text style={styles.title}>กรอกข้อมูลผู้ป่วย</Text>
            <Text style={styles.subtitle}>Patient Information</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={1000} delay={200} style={styles.card}>
            <Text style={styles.label}>เลือกวอร์ด / Ward</Text>
            <View style={styles.selectContainer}>
              {wards.map((ward) => (
                <TouchableOpacity
                  key={ward.value}
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

            <View style={styles.inputGroup}>
                <Text style={styles.label}>ชื่อ (First Name)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="เช่น สมชาย"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                    placeholderTextColor="#9DA8B7"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>นามสกุล (Last Name)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="เช่น ใจดี"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                    placeholderTextColor="#9DA8B7"
                />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>หมายเลข HN (Hospital Number)</Text>
              <TextInput
                style={styles.input}
                placeholder="กรอกหมายเลข HN"
                value={formData.hn}
                onChangeText={(text) => setFormData({ ...formData, hn: text })}
                keyboardType="numeric"
                placeholderTextColor="#9DA8B7"
              />
            </View>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
            <TouchableOpacity
              style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
              onPress={handleNext}
              disabled={!isFormValid}
            >
              <Text style={styles.nextButtonText}>ต่อไป (Next)</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eafaf7',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderColor: '#0B6258',
    borderWidth: 2,
  },
  logoIcon: {
    fontSize: 40,
    color: '#0B6258',
  },
  title: {
    fontSize: 28,
    fontFamily: 'IBMPlexSansThai-Bold',
    color: '#0B6258',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'IBMPlexSans-Regular',
    color: '#0B6258',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#0B6258',
    marginBottom: 12,
    fontWeight: '600',
  },
  selectContainer: {
    marginBottom: 16,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#b2dfd5',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f6fffd',
  },
  selectedOption: {
    backgroundColor: '#0B6258',
    borderColor: '#0B6258',
  },
  optionText: {
    fontFamily: 'IBMPlexSansThai-Regular',
    fontSize: 16,
    color: '#0B6258',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#b2dfd5',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    backgroundColor: '#f6fffd',
    color: '#0B6258',
  },
  nextButton: {
    backgroundColor: '#0B6258',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0B6258',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#b2dfd5',
    elevation: 0,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'IBMPlexSansThai-Bold',
  },
});

export default PatientInfoScreen;
