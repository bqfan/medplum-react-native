import { useMedplum } from '@medplum/react-hooks';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/* eslint-disable max-lines-per-function */
const PatientList = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [patientsPerPage] = useState(10);
  const medplum = useMedplum();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await medplum.searchResources('Patient', {
          _count: patientsPerPage,
          _offset: (currentPage - 1) * patientsPerPage,
        });
        setPatients(response);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentPage, patientsPerPage, medplum]);

  const renderPatientItem = ({ item }: { item: any }) => (
    <View style={styles.patientItem}>
      <Text style={styles.patientName}>
        {item.name?.[0]?.given?.join(' ')} {item.name?.[0]?.family}
      </Text>
      <Text style={styles.patientId}>ID: {item.id}</Text>
    </View>
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={patients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.paginationContainer}>
            <Button
              title="Previous"
              onPress={handlePreviousPage}
              disabled={currentPage === 1 || loading}
            />
            <Text className="dark:text-neutral-100">Page {currentPage}</Text>
            <Button
              title="Next"
              onPress={handleNextPage}
              disabled={patients.length < patientsPerPage || loading}
            />
          </View>
        </>
      )}
    </View>
  );
};

// Keep the same styles as previous example
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  patientItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientId: {
    fontSize: 14,
    color: '#666',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  pageNumber: {
    fontSize: 16,
  },
});

export default PatientList;
