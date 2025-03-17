// src/app/(app)/patient/[patientId]/index.tsx
import type {
  Bundle,
  BundleEntry,
  DiagnosticReport,
  Observation,
  Patient,
} from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react-hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const [loading, setLoading] = useState(true);
  const [_, setError] = useState<string>();
  const [patient, setPatient] = useState<Patient>();
  const [reports, setReports] = useState<
    (DiagnosticReport & { observations: Observation[] })[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fix Patient type assertion
        const pt = await medplum.readResource('Patient', patientId as string);
        setPatient(pt as Patient); // Explicit type assertion

        // 2. Use correct search method with proper generics
        const bundle: Bundle<DiagnosticReport> = await medplum.search(
          'DiagnosticReport',
          `subject=Patient/${patientId}&_include=DiagnosticReport:result`
        );

        // 3. Process bundle entries
        const entries: BundleEntry[] = bundle.entry || [];

        // 4. Extract all observations first
        const observations = entries
          .filter(
            (entry): entry is BundleEntry<Observation> =>
              entry.resource?.resourceType === 'Observation'
          )
          .map((entry) => entry.resource as Observation);

        // 5. Map reports with their observations
        const diagnostics = entries
          .filter(
            (entry): entry is BundleEntry<DiagnosticReport> =>
              entry.resource?.resourceType === 'DiagnosticReport'
          )
          .map((entry) => {
            const report = entry.resource as DiagnosticReport;
            return {
              ...report,
              observations: observations.filter((obs) =>
                report.result?.some((ref: fhir4.Reference) =>
                  ref.reference?.endsWith(`/${obs.id}`)
                )
              ),
            };
          });

        setReports(diagnostics);
        setError(undefined);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
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
        {/* Patient Details Section */}
        <View className="px-1 pb-6 pt-2">
          <Text className="mb-2 text-lg font-bold dark:text-gray-100">
            Patient Details
          </Text>
          <View className="flex-row flex-wrap gap-y-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
            {/* Name */}
            <View className="w-1/2 pr-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Family Name
              </Text>
              <Text className="text-base font-medium dark:text-gray-200">
                {patient?.name?.[0]?.family}
              </Text>
            </View>

            <View className="w-1/2 pl-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Given Name
              </Text>
              <Text className="text-base font-medium dark:text-gray-200">
                {patient?.name?.[0]?.given}
              </Text>
            </View>

            {/* SSN */}
            <View className="w-1/2 pr-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
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
            <View className="w-1/2 pl-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Gender
              </Text>
              <Text className="text-base dark:text-gray-300">
                {patient?.gender?.toUpperCase() || 'N/A'}
              </Text>
            </View>

            {/* Birth Date */}
            <View className="w-1/2 pr-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Birth Date
              </Text>
              <Text className="text-base dark:text-gray-300">
                {formatDate(patient?.birthDate ?? null) || 'N/A'}
              </Text>
            </View>

            {/* Phone */}
            <View className="w-1/2 pl-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Phone
              </Text>
              <Text className="text-base dark:text-gray-300">
                {patient?.telecom?.find(
                  (t: fhir4.ContactPoint) => t?.system === 'phone'
                )?.value || 'N/A'}
              </Text>
            </View>

            {/* Status */}
            <View className="w-1/2 pr-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
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
                {reports[0]?.observations[0]?.valueQuantity?.value ??
                  'No value available'}
              </Text>
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
              {report.observations.map((obs) => (
                <View key={obs.id} className="mt-2">
                  <Text className="text-sm">
                    Code: {obs?.valueQuantity?.code ?? 'N/A'}
                  </Text>
                  <Text className="text-sm">
                    Unit: {obs?.valueQuantity?.unit ?? 'N/A'}
                  </Text>
                  <Text className="text-sm">
                    Value: {obs?.valueQuantity?.value?.toString() ?? 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
