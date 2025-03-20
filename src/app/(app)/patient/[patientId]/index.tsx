// src/app/(app)/patient/[patientId]/index.tsx
import { useMedplum } from '@medplum/react-hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type {
  Bundle,
  BundleEntry,
  DiagnosticReport,
  Observation,
  Patient,
} from 'fhir/r4';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

import PatientScreen from '@/components/patient-screen';
import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ExtendedDiagnosticReport extends DiagnosticReport {
  observations?: Observation[];
}

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
        const bundle: Bundle<ExtendedDiagnosticReport> = await medplum.search(
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
            (entry): entry is BundleEntry<ExtendedDiagnosticReport> =>
              entry.resource?.resourceType === 'DiagnosticReport'
          )
          .map((entry) => {
            const report = entry.resource as ExtendedDiagnosticReport;
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
    <SafeAreaView className="w-full flex-1 items-center justify-center">
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

        {patient ? (
          <PatientScreen patient={patient} reports={reports} />
        ) : (
          <View className="flex-1 items-center justify-center">
            No patient selected
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
