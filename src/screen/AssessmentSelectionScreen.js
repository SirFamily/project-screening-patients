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

const AssessmentSelectionScreen = () => {
  const { patientData, updatePatientData } = usePatientContext();
  const navigation = useNavigation();

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
      <StatusBar barStyle="light-content" backgroundColor="#0B6258" />
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <Text style={styles.title}>เลือกแบบประเมิน</Text>
          <Text style={styles.subtitle}>Assessment Selection</Text>
        </Animatable.View>

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

        <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>‹ ย้อนกลับ</Text>
            </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
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
    marginBottom: 32,
    alignItems: 'center',
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
    opacity: 0.8,
    marginTop: 4,
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
  backButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#0B6258',
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Bold',
    textDecorationLine: 'underline',
  },
});

export default AssessmentSelectionScreen;
