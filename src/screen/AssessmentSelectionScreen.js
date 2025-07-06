import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatientContext } from '../context/PatientContext';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';

const AssessmentSelectionScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();
  useBackButtonExitHandler();

  const handleSelectAssessment = (type) => {
    updatePatientData({ assessment: { ...patientData.assessment, type: type } });
    if (type === 'SOFA') {
      navigation.navigate('PatientSOFA');
    } else {
      navigation.navigate('PatientAPACHE');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerContent}>
          <Text style={styles.title}>เลือกแบบประเมิน</Text>
          <Text style={styles.subtitle}>Assessment Selection</Text>
        </Animatable.View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
          <TouchableOpacity
            style={styles.assessmentCard}
            onPress={() => handleSelectAssessment('SOFA')}
          >
            <View style={styles.cardIconContainer}>
                <Text style={styles.assessmentIcon}>🫁</Text>
            </View>
            <View style={styles.cardTextContainer}>
                <Text style={styles.assessmentTitle}>SOFA Score</Text>
                <Text style={styles.assessmentDescription}>
                ประเมิน 6 ระบบของร่างกายเพื่อติดตามการทำงานของอวัยวะ
                </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.assessmentCard}
            onPress={() => handleSelectAssessment('APACHE')}
          >
            <View style={styles.cardIconContainer}>
                <Text style={styles.assessmentIcon}>❤️</Text>
            </View>
            <View style={styles.cardTextContainer}>
                <Text style={styles.assessmentTitle}>APACHE II Score</Text>
                <Text style={styles.assessmentDescription}>
                ประเมินความรุนแรงของโรคโดยใช้ 12 ตัวแปรทางสรีรวิทยา
                </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F4F7F6',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginRight: 44, // Offset for back button
  },
  backButton: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
    elevation: 3,
  },
  backButtonText: { fontSize: 24, color: '#0B6258', fontWeight: 'bold' },
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
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    transition: 'all 0.3s ease',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f6fffd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderColor: '#b2dfd5',
    borderWidth: 1.5,
  },
  assessmentIcon: {
    fontSize: 30,
  },
  cardTextContainer: {
    flex: 1,
  },
  assessmentTitle: {
    fontSize: 18,
    fontFamily: 'IBMPlexSansThai-Bold',
    color: '#0B6258',
    marginBottom: 4,
  },
  assessmentDescription: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#0B6258',
    opacity: 0.9,
    lineHeight: 20,
  },
});

export default AssessmentSelectionScreen;
