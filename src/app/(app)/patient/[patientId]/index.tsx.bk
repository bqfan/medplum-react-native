// src/app/(app)/patient/[patientId]/index.tsx
import { useMedplum } from '@medplum/react-hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

interface DiagnosticReport {
  id: string;
  code?: { text?: string };
  status?: string;
  effectiveDateTime?: string;
  conclusion?: string;
}

/* eslint-disable max-lines-per-function */
export default function PatientDetails() {
  const { patientId } = useLocalSearchParams();
  const medplum = useMedplum();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
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
  }, [patientId]);

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
        <Text className="mb-4 text-xl font-bold">Patient Details</Text>

        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold">
            {patient.name?.[0]?.given?.join(' ')} {patient.name?.[0]?.family}
          </Text>
          <Text className="mb-1">
            Birth Date: {patient.birthDate || 'Unknown'}
          </Text>
          <Text>
            SSN:{' '}
            {patient.identifier?.find(
              (id: any) => id.system === 'http://hl7.org/fhir/sid/us-ssn'
            )?.value || 'N/A'}
          </Text>
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
                Date: {report.effectiveDateTime || 'Unknown'}
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
