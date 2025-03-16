// src/app/(app)/patient/[patientId]/index.tsx
import { useMedplum } from '@medplum/react-hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { DiagnosticReport } from 'fhir/r4';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

/* eslint-disable max-lines-per-function */
export default function PatientDetails() {
  const { patientId } = useLocalSearchParams();
  const medplum = useMedplum();
  const router = useRouter();
  const [patient, setPatient] = useState<fhir4.Patient | undefined>();
  const [reports, setReports] = useState<DiagnosticReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pt = await medplum.readResource('Patient', patientId as string);
        setPatient(pt);

        const diagnostics = await medplum.searchResources('DiagnosticReport', {
          subject: `Patient/${patientId}`,
          _include: 'DiagnosticReport:result', // Use string instead of array
        });
        setReports(diagnostics);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId, medplum]);

  if (loading) return <Spinner />;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Back Button */}
      <View className="border-b border-gray-200 p-4 dark:border-gray-700">
        <Button
          //variant="ghost"
          className="self-start"
          onPress={() => router.back()}
        >
          <ButtonText>← Back to Patients</ButtonText>
        </Button>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 p-4">
        <View className="px-4 pb-6 pt-4">
          {/* Patient Details Section */}
          <Text className="mb-6 text-2xl font-bold dark:text-gray-100">
            Patient Details
          </Text>
          <View className="flex-row flex-wrap gap-4">
            {/* Name */}
            <View className="w-full md:w-[48%]">
              <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Name
              </Text>
              <Text className="text-base font-medium dark:text-gray-200">
                {patient?.name?.[0]?.given?.join(' ')}{' '}
                {patient?.name?.[0]?.family}
              </Text>
            </View>

            {/* SSN */}
            <View className="w-full md:w-[48%]">
              <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                SSN
              </Text>
              <Text className="text-base dark:text-gray-300">
                {patient?.identifier?.find(
                  (id: fhir4.Identifier) =>
                    id.system === 'http://hl7.org/fhir/sid/us-ssn'
                )?.value || 'N/A'}
              </Text>
            </View>

            {/* Gender */}
            <View className="w-full md:w-[48%]">
              <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Gender
              </Text>
              <Text className="text-base dark:text-gray-300">
                {patient?.gender?.toUpperCase() || 'N/A'}
              </Text>
            </View>

            {/* Birth Date */}
            <View className="w-full md:w-[48%]">
              <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Birth Date
              </Text>
              <Text className="text-base dark:text-gray-300">
                {formatDate(patient?.birthDate ?? null) || 'N/A'}
              </Text>
            </View>

            {/* Phone */}
            <View className="w-full md:w-[48%]">
              <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Phone
              </Text>
              <Text className="text-base dark:text-gray-300">
                {patient?.telecom?.find((t) => t.system === 'phone')?.value ||
                  'N/A'}
              </Text>
            </View>

            {/* Active Status */}
            <View className="w-full md:w-[48%]">
              <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Status
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className={`size-3 rounded-full ${
                    patient?.active
                      ? 'bg-green-500 dark:bg-green-400'
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                />
                <Text className="text-base dark:text-gray-300">
                  {patient?.active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text className="mb-2 text-lg font-bold">Diagnostic Reports</Text>
        {reports.length === 0 ? (
          <Text className="text-gray-500 dark:text-gray-400">
            No diagnostic reports found
          </Text>
        ) : (
          reports.map((report) => (
            <View
              key={report.id}
              className="mb-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800"
            >
              <Text className="mb-1 text-base font-semibold">
                {report.code?.text || 'Unnamed Report'}
              </Text>
              <Text className="mb-1 text-sm">Status: {report.status}</Text>
              <Text className="mb-1 text-sm">
                Date: {formatDate(report.effectiveDateTime ?? null) || 'N/A'}
              </Text>
              {report.conclusion && (
                <Text className="mt-2 text-sm">
                  Conclusion: {report.conclusion}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
