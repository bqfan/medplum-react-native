import { useMedplum } from '@medplum/react-hooks';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

/* eslint-disable max-lines-per-function */
const PatientList = () => {
  const [patients, setPatients] = useState<
    {
      id: string;
      name?: { given?: string[]; family?: string }[];
      gender: string;
      birthDate: string;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [patientsPerPage] = useState(20);
  const medplum = useMedplum();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await medplum.searchResources('Patient', {
          _count: patientsPerPage,
          _offset: (currentPage - 1) * patientsPerPage,
        });
        setPatients(
          response.map((patient: any) => ({
            id: patient.id,
            name: patient.name,
            gender: patient.gender || 'unknown',
            birthDate: patient.birthDate || 'unknown',
          }))
        );
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentPage, patientsPerPage, medplum]);

  const renderPatientItem = ({
    item,
  }: {
    item: {
      id: string;
      name?: { given?: string[]; family?: string }[];
      gender: string;
      birthDate: string;
    };
  }) => (
    <View className="mb-2 rounded-lg bg-white p-2 shadow-sm">
      <Text className="text-sm dark:text-neutral-600">
        {item.name?.[0]?.given?.join(' ')} {item.name?.[0]?.family}{' '}
        {item.gender} {item.birthDate}
      </Text>
      {/* <Text style={styles.patientId}>ID: {item.id}</Text> */}
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
    <View className="flex-1 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={patients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            className="pb-4"
          />
          <View className="flex-row items-center justify-between py-4">
            <Button
              onPress={handlePreviousPage}
              isDisabled={currentPage === 1 || loading}
            >
              <ButtonText>Previous</ButtonText>
            </Button>
            <Text className="dark:text-neutral-100">Page {currentPage}</Text>
            <Button
              onPress={handleNextPage}
              isDisabled={patients.length < patientsPerPage || loading}
            >
              <ButtonText>Next</ButtonText>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default PatientList;
