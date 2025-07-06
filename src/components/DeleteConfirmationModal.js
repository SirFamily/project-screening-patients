
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const DeleteConfirmationModal = ({ visible, onDelete, onCancel, isDeleting }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>ยืนยันการลบข้อมูล</Text>
          <Text style={styles.message}>คุณต้องการลบข้อมูลการประเมินนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</Text>
          
          {isDeleting ? (
            <ActivityIndicator size="large" color="#FF6B6B" />
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
                <Text style={[styles.buttonText, styles.deleteButtonText]}>ลบ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 22,
    color: '#2C3E50',
    marginBottom: 15,
  },
  message: {
    fontFamily: 'IBMPlexSansThai-Regular',
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButton: {
    backgroundColor: '#E0E6EB',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Bold',
  },
  deleteButtonText: {
    color: 'white',
  },
  cancelButtonText: {
    color: '#2C3E50',
  },
});

export default DeleteConfirmationModal;
