import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getSavedPatients, deleteEvaluation } from '../api/evaluationService';
import * as Animatable from 'react-native-animatable';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ITEMS_PER_PAGE = 5;

const SavedRecordsScreen = () => {
  const navigation = useNavigation();
  const [allPatients, setAllPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPatients = async () => {
    try {
      const data = await getSavedPatients();
      setAllPatients(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedPatients(allPatients.slice(startIndex, endIndex));
  }, [allPatients, currentPage]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPatients();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchPatients();
  };

  const handleDelete = (evaluationId) => {
    setEvaluationToDelete(evaluationId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (evaluationToDelete) {
      setIsDeleting(true);
      try {
        await deleteEvaluation(evaluationToDelete);
        fetchPatients();
      } catch (error) {
        console.error("Failed to delete evaluation:", error);
      } finally {
        setIsDeleting(false);
        setIsDeleteModalVisible(false);
        setEvaluationToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setEvaluationToDelete(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity 
        style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <Text style={styles.paginationButtonText}>ก่อนหน้า</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>{`หน้า ${currentPage} จาก ${totalPages}`}</Text>
      <TouchableOpacity 
        style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
        onPress={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        <Text style={styles.paginationButtonText}>ถัดไป</Text>
      </TouchableOpacity>
    </View>
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
        data={displayedPatients}
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
        ListFooterComponent={totalPages > 1 ? renderPagination : null}
      />
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onDelete={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
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
  backButtonText: { fontSize: 24, color: '#0B6258', fontFamily: 'IBMPlexSansThai-Bold' },
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paginationButton: {
    backgroundColor: '#0B6258',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  paginationButtonText: {
    color: 'white',
    fontFamily: 'IBMPlexSansThai-Bold',
    fontSize: 14,
  },
  paginationText: {
    fontFamily: 'IBMPlexSansThai-Regular',
    fontSize: 16,
    color: '#2C3E50',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
});

export default SavedRecordsScreen;
