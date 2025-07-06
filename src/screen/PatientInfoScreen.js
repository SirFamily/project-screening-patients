import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';

const wards = [
  { label: 'ห้องฉุกเฉิน (Emergency)', value: 'AE', icon: '🚑' },
  { label: 'วอร์ดผู้ป่วยทั่วไป (General Ward)', value: 'ward', icon: '🛌' },
  { label: 'หอผู้ป่วยหนัก (ICU)', value: 'ICU', icon: '❤️‍🩹' },
];

const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#9DA8B7"
            keyboardType={keyboardType}
        />
    </View>
  );

const genders = [
    { label: 'ชาย (Male)', value: 'male', icon: '👨' },
    { label: 'หญิง (Female)', value: 'female', icon: '👩' },
  ];
  
  const PatientInfoScreen = () => {
    const { updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  useBackButtonExitHandler(); // Block back button
  const [formData, setFormData] = useState({
      ward: '',
      firstName: '',
      lastName: '',
      hn: '',
      gender: '',
    });
  
    const handleNext = () => {
      updatePatientData({
        info: {
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`
        }
      });
      navigation.navigate('AssessmentSelection');
    };
  
    const isFormValid = formData.ward && formData.firstName && formData.lastName && formData.hn && formData.gender;
  
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
              <View style={styles.headerIconContainer}>
                  <Text style={styles.headerIcon}>📋</Text>
              </View>
              <Text style={styles.title}>ข้อมูลผู้ป่วย</Text>
              <Text style={styles.subtitle}>Patient Information</Text>
            </Animatable.View>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView contentContainerStyle={styles.container}>
  
            <Animatable.View animation="fadeInUp" duration={900} delay={200}>
              <View style={styles.card}>
                  <Text style={styles.cardTitle}>เลือกวอร์ด / Ward</Text>
                  {wards.map((ward) => (
                      <TouchableOpacity
                          key={ward.value}
                          style={[
                              styles.optionCard,
                              formData.ward === ward.value && styles.selectedOptionCard
                          ]}
                          onPress={() => setFormData({ ...formData, ward: ward.value })}
                      >
                          <Text style={styles.optionIcon}>{ward.icon}</Text>
                          <Text style={[styles.optionText, formData.ward === ward.value && styles.selectedOptionText]}>
                              {ward.label}
                          </Text>
                      </TouchableOpacity>
                  ))}
              </View>
  
              <View style={styles.card}>
                  <Text style={styles.cardTitle}>เพศ / Sex</Text>
                  <View style={styles.genderContainer}>
                  {genders.map((gender) => (
                      <TouchableOpacity
                          key={gender.value}
                          style={[
                              styles.optionCard,
                              styles.genderOptionCard,
                              formData.gender === gender.value && styles.selectedOptionCard
                          ]}
                          onPress={() => setFormData({ ...formData, gender: gender.value })}
                      >
                          <Text style={styles.optionIcon}>{gender.icon}</Text>
                          <Text style={[styles.optionText, formData.gender === gender.value && styles.selectedOptionText]}>
                              {gender.label}
                          </Text>
                      </TouchableOpacity>
                  ))}
                  </View>
              </View>
  
              <View style={styles.card}>
                  <InputField 
                      label="ชื่อ (First Name)" 
                      placeholder="เช่น สมชาย"
                      value={formData.firstName}
                      onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  />
                   <InputField 
                      label="นามสกุล (Last Name)" 
                      placeholder="เช่น ใจดี"
                      value={formData.lastName}
                      onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                  />
                   <InputField 
                      label="หมายเลข HN (Hospital Number)"
                      placeholder="กรอกหมายเลข HN"
                      value={formData.hn}
                      onChangeText={(text) => setFormData({ ...formData, hn: text })}
                      keyboardType="numeric"
                  />
              </View>
            </Animatable.View>
  
          </ScrollView>
          <Animatable.View animation="slideInUp" duration={500}>
              <View style={styles.footer}>
                  <TouchableOpacity
                  style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
                  onPress={handleNext}
                  disabled={!isFormValid}
                  >
                  <Text style={styles.nextButtonText}>ต่อไป (Next)</Text>
                  </TouchableOpacity>
              </View>
          </Animatable.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  container: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingBottom: 120, // Space for the footer
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0B6258',
    fontWeight: 'bold',
  },
  headerIconContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  headerIcon: { fontSize: 40 },
  title: {
    fontSize: 28,
    fontFamily: 'IBMPlexSansThai-Bold',
    color: '#0B6258',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'IBMPlexSans-Regular',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  cardTitle: {
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 18, 
    color: '#2C3E50',
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E0E6EB',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  selectedOptionCard: {
    backgroundColor: '#0B6258',
    borderColor: '#0B6258',
  },
  optionIcon: { fontSize: 22, marginRight: 12 },
  optionText: {
    fontFamily: 'IBMPlexSansThai-Regular',
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontFamily: 'IBMPlexSansThai-Bold',
    color: '#FFFFFF',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOptionCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F4F7F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E6EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    color: '#2C3E50',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E6EB',
  },
  nextButton: {
    backgroundColor: '#0B6258',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0B6258',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#B2DFD5',
    elevation: 0,
    shadowOpacity: 0,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'IBMPlexSansThai-Bold',
  },
});

export default PatientInfoScreen;