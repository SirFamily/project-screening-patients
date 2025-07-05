import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const ExitConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onCancel} // Handle hardware back button on Android
    >
      <View style={styles.overlay}>
        <Animatable.View
          animation="zoomIn"
          duration={300}
          style={styles.modalContainer}
        >
          <Text style={styles.title}>ออกจากแอป</Text>
          <Text style={styles.message}>
            คุณต้องการออกจากแอปพลิเคชันหรือไม่? ข้อมูลทั้งหมดจะถูกรีเซ็ตและคุณจะกลับสู่หน้าแรก
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
              <Text style={styles.buttonTextCancel}>ไม่</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonConfirm} onPress={onConfirm}>
              <Text style={styles.buttonTextConfirm}>ใช่</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'IBMPlexSansThai-Bold',
    color: '#0B6258',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: '#E0E6EB',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonConfirm: {
    flex: 1,
    backgroundColor: '#0B6258',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonTextCancel: {
    color: '#2C3E50',
    fontSize: 17,
    fontFamily: 'IBMPlexSansThai-Bold',
  },
  buttonTextConfirm: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'IBMPlexSansThai-Bold',
  },
});

export default ExitConfirmationModal;
