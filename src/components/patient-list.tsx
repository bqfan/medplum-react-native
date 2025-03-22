import { useMedplum } from '@medplum/react-hooks';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

/* eslint-disable max-lines-per-function */
const PatientList = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<
    {
      id: string;
      name?: { given?: string[]; family?: string }[];
      birthDate: string;
      ssn: string;
      gender: string;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [patientsPerPage] = useState(30);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const medplum = useMedplum();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          _count: patientsPerPage,
          _offset: (currentPage - 1) * patientsPerPage,
        };

        if (debouncedSearchTerm) {
          params.name = debouncedSearchTerm;
        }

        const response = await medplum.searchResources('Patient', params);
        setPatients(
          response.map((patient: any) => ({
            id: patient.id,
            name: patient.name,
            ssn:
              patient.identifier?.find(
                (id: any) => id.system === 'http://hl7.org/fhir/sid/us-ssn'
              )?.value || 'N/A',
            gender: patient.gender || 'N/A',
            birthDate: patient.birthDate || 'N/A',
          }))
        );
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentPage, patientsPerPage, medplum, debouncedSearchTerm]);

  const renderPatientItem = ({
    item,
    index,
  }: {
    item: {
      id: string;
      name?: { given?: string[]; family?: string }[];
      birthDate: string;
      ssn: string;
      gender: string;
    };
    index: number;
  }) => (
    <Pressable onPress={() => router.push(`/(app)/patient/${item.id}`)}>
      <View
        className={`flex-row items-center p-3 ${
          index % 2 === 0
            ? 'bg-gray-100 dark:bg-gray-800'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        {/* Name Column */}
        <View className="w-1/4 border-r border-gray-300 pr-2 dark:border-gray-600">
          <Text
            numberOfLines={1}
            className="truncate text-sm text-gray-700 dark:text-gray-300"
          >
            {item.name?.[0]?.given?.join(' ')} {item.name?.[0]?.family}
          </Text>
        </View>

        {/* SSN Column */}
        <View className="w-[30%] border-r border-gray-300 px-2 dark:border-gray-600">
          <Text
            numberOfLines={1}
            className="truncate text-sm text-gray-700 dark:text-gray-300"
          >
            {item.ssn}
          </Text>
        </View>

        <View className="w-1/5 border-r border-gray-300 px-2 dark:border-gray-600">
          <Text
            numberOfLines={1}
            className="truncate text-sm text-gray-700 dark:text-gray-300"
          >
            {item.gender}
          </Text>
        </View>

        {/* Wider Birthdate Column */}
        <View className="w-1/4 px-1">
          <Text
            numberOfLines={1}
            className="truncate text-sm text-gray-700 dark:text-gray-300"
          >
            {item.birthDate}
          </Text>
        </View>
      </View>
    </Pressable>
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
      {/* Search Input */}
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        placeholder="Search by name..."
        placeholderTextColor="#6b7280"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <View className="items-center py-4">
          <Spinner
            size="small"
            className="size-8 text-gray-500 dark:text-gray-400"
          />
        </View>
      ) : (
        <>
          {/* Table Header */}
          <View className="flex-row items-center bg-gray-300 p-3 dark:bg-gray-900">
            <View className="w-1/4 border-r border-gray-100 pr-2 dark:border-gray-700">
              <Text className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Name
              </Text>
            </View>
            <View className="w-[30%] border-r border-gray-100 px-2 dark:border-gray-700">
              <Text className="text-sm font-bold text-gray-900 dark:text-gray-100">
                SSN
              </Text>
            </View>
            <View className="w-1/5 border-r border-gray-100 px-2 dark:border-gray-700">
              <Text className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                Gender
              </Text>
            </View>
            <View className="w-1/4 px-1">
              <Text className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Birthdate
              </Text>
            </View>
          </View>

          {/* FlashList for Performance */}
          <FlashList
            data={patients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            estimatedItemSize={50}
            ListEmptyComponent={
              !loading && (
                <Text className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No patients found
                  {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
                </Text>
              )
            }
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
