import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getSavedPatients, deleteEvaluation } from '../api/evaluationService';
import * as Animatable from 'react-native-animatable';
import useBackButtonExitHandler from '../hooks/useBackButtonExitHandler';

const SavedRecordsScreen = () => {
  const navigation = useNavigation();
  useBackButtonExitHandler();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPatients = async () => {
    try {
      const data = await getSavedPatients();
      setPatients(data);
    } catch (error) {
      console.error(error);
      // Optionally, show an alert to the user
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPatients();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  const handleDelete = async (evaluationId) => {
    Alert.alert(
      "ยืนยันการลบข้อมูล",
      "คุณต้องการลบข้อมูลการประเมินนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้",
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ลบ",
          onPress: async () => {
            try {
              await deleteEvaluation(evaluationId);
              Alert.alert("ลบสำเร็จ", "ข้อมูลการประเมินถูกลบเรียบร้อยแล้ว");
              fetchPatients(); // Refresh the list after deletion
            } catch (error) {
              console.error("Failed to delete evaluation:", error);
              Alert.alert("ลบไม่สำเร็จ", "ไม่สามารถลบข้อมูลการประเมินได้ กรุณาลองใหม่อีกครั้ง");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" duration={500} delay={index * 100}>
      <TouchableOpacity 
        style={styles.recordCard}
        onPress={() => navigation.navigate('RecordDetail', { evaluation: item.evaluations[0], patient: item })}
      >
        <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.patientHn}>HN: {item.hn}</Text>
            {item.evaluations[0]?.createdAt && (
              <Text style={styles.recordDate}>
                บันทึกเมื่อ: {new Date(item.evaluations[0].createdAt).toLocaleString()}
              </Text>
            )}
        </View>
        <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>REH Score</Text>
            <Text style={styles.scoreValue}>{item.evaluations[0]?.totalRehScore ?? 'N/A'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.evaluations[0].id)}
        >
          <Text style={styles.deleteButtonText}>ลบ</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0B6258" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รายการที่บันทึกไว้</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
            <View style={styles.centeredContainer}>
                <Text style={styles.emptyText}>ยังไม่มีข้อมูลที่บันทึกไว้</Text>
            </View>
        )}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0B6258']} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, },
  headerTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 24, color: '#0B6258' },
  backButton: { padding: 5 },
  backButtonText: { fontSize: 24, color: '#0B6258', fontWeight: 'bold' },
  headerTitle: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 24, color: '#0B6258' },
  listContainer: { padding: 20 },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,
  },
  patientInfo: { flex: 1 },
  patientName: { fontFamily: 'IBMPlexSansThai-Bold', fontSize: 18, color: '#2C3E50' },
  patientHn: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 14, color: '#7F8C8D', marginTop: 4 },
  scoreContainer: { alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  scoreLabel: { fontFamily: 'IBMPlexSans-Medium', fontSize: 12, color: '#388E3C' },
  scoreValue: { fontFamily: 'IBMPlexSans-Bold', fontSize: 22, color: '#388E3C' },
  emptyText: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 16, color: '#7F8C8D' },
  recordDate: { fontFamily: 'IBMPlexSansThai-Regular', fontSize: 12, color: '#7F8C8D', marginTop: 4 },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 14,
  },
});

export default SavedRecordsScreen;
