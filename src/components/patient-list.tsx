import { useMedplum } from '@medplum/react-hooks';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

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
    index,
  }: {
    item: {
      id: string;
      name?: { given?: string[]; family?: string }[];
      gender: string;
      birthDate: string;
    };
    index: number;
  }) => (
    <View
      className={`flex-row items-center p-3 ${
        index % 2 === 0
          ? 'bg-gray-100 dark:bg-gray-800' // Light gray for light mode, darker gray for dark mode
          : 'bg-gray-200 dark:bg-gray-700' // Darker gray for light mode, even darker for dark mode
      }`}
    >
      <Text className="flex-[2] text-sm text-gray-700 dark:text-gray-300">
        {item.name?.[0]?.given?.join(' ')} {item.name?.[0]?.family}
      </Text>
      <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
        {item.gender}
      </Text>
      <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
        {item.birthDate}
      </Text>
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
    <View className="flex-1 bg-white p-4 dark:bg-black">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Table Header */}
          <View className="flex-row items-center bg-gray-300 p-3 dark:bg-gray-900">
            <Text className="flex-[2] text-base font-bold text-gray-900 dark:text-gray-100">
              Name
            </Text>
            <Text className="flex-1 text-base font-bold text-gray-900 dark:text-gray-100">
              Gender
            </Text>
            <Text className="flex-1 text-base font-bold text-gray-900 dark:text-gray-100">
              Birthdate
            </Text>
          </View>

          {/* FlashList for Performance */}
          <FlashList
            data={patients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            estimatedItemSize={50} // Adjust based on row height
          />

          {/* Pagination Controls */}
          <View className="flex-row items-center justify-between py-4">
            <Button
              onPress={handlePreviousPage}
              isDisabled={currentPage === 1 || loading}
            >
              <ButtonText>Previous</ButtonText>
            </Button>
            <Text className="text-gray-900 dark:text-gray-100">
              Page {currentPage}
            </Text>
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
