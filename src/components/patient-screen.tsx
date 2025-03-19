import type { DiagnosticReport, Observation, Patient } from 'fhir/r4';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';

const getInterpretation = (
  input: string | fhir4.CodeableConcept[] | undefined
): string => {
  if (!input) return 'N/A';

  if (typeof input === 'string') {
    return input;
  }

  if (Array.isArray(input)) {
    return (
      input
        .map(
          (concept) =>
            concept.text ||
            concept.coding?.[0]?.display ||
            concept.coding?.[0]?.code
        )
        .filter(Boolean)
        .join(', ') || 'N/A'
    );
  }

  return 'N/A';
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// FHIR type interfaces
interface ExtendedDiagnosticReport extends DiagnosticReport {
  observations?: Observation[];
}
interface ReferenceRange {
  low?: { value?: number; unit?: string };
  high?: { value?: number; unit?: string };
  type?: { text?: string };
}
interface PatientScreenProps {
  patient: Patient;
  reports: DiagnosticReport[];
}

/* eslint-disable max-lines-per-function */
const PatientScreen = ({ patient, reports }: PatientScreenProps) => {
  return (
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
        reports.map((report: ExtendedDiagnosticReport) => (
          <View key={report.id}>
            <View className="flex-row flex-wrap gap-y-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
              <Text className="mb-1 text-base font-semibold">
                {report.code?.text || 'Unnamed Report'}
              </Text>
              <View className="w-1/2 pr-2">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </Text>
                <View className="flex-row items-center gap-2">
                  <View
                    className={`size-3 rounded-full ${
                      report?.status === 'final'
                        ? 'bg-green-500 dark:bg-green-400'
                        : 'bg-gray-400 dark:bg-gray-600'
                    }`}
                  />
                  <Text className="text-sm">{report?.status ?? 'N/A'}</Text>
                </View>
              </View>
              <View className="w-1/2 pl-2">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Effective Date
                </Text>
                <Text className="text-sm dark:text-gray-300">
                  {formatDate(report.effectiveDateTime ?? null) || 'N/A'}
                </Text>
              </View>
              {report.conclusion && (
                <View className="w-1/2 pl-2">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Conclusion
                  </Text>
                  <Text className="text-sm dark:text-gray-300">
                    {report.conclusion}
                  </Text>
                </View>
              )}
              {report?.observations?.map((obs: Observation) => (
                <View
                  key={obs.id}
                  className="my-4 mt-0 w-full rounded-md bg-gray-200 p-3 dark:bg-gray-600"
                >
                  <Text className="mb-2 mt-0 text-sm font-semibold text-gray-900 dark:text-gray-300">
                    {obs?.code?.text ?? 'N/A'}
                  </Text>
                  {/* valueQuantity */}
                  <View className="flex-row flex-wrap gap-y-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <View className="w-1/2 pr-2">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Value
                      </Text>
                      <Text className="text-xs font-semibold dark:text-gray-200">
                        {obs?.valueQuantity?.value?.toFixed(2).toString() ??
                          'N/A'}{' '}
                        {obs?.valueQuantity?.unit ?? 'N/A'}
                      </Text>
                    </View>
                    {/* Reference Ranges */}
                    <View className="w-1/2 pl-2">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Reference Ranges
                      </Text>
                      <Text className="text-xs font-medium dark:text-gray-200">
                        {obs?.referenceRange?.map((range: ReferenceRange) => {
                          const rangeKey =
                            [
                              range.type?.text,
                              range.low?.value,
                              range.low?.unit,
                              range.high?.value,
                              range.high?.unit,
                            ]
                              .filter(Boolean)
                              .join('-')
                              .replace(/\s+/g, '_') || crypto.randomUUID();

                          return (
                            <Text key={rangeKey} className="text-xs">
                              Reference Range (
                              {range.type?.text || 'Unknown type'}
                              ): {range.low?.value?.toString() ?? 'N/A'}{' '}
                              {range.low?.unit || ''} -{' '}
                              {range.high?.value?.toString() ?? 'N/A'}{' '}
                              {range.high?.unit || ''}
                            </Text>
                          );
                        })}
                        {!obs?.referenceRange?.length && (
                          <Text className="text-xs">N/A</Text>
                        )}
                      </Text>
                    </View>

                    {/* Categories */}
                    <View className="w-1/2 pr-2">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Category
                      </Text>
                      <Text className="text-xs font-medium dark:text-gray-200">
                        {obs?.category?.map((category) => {
                          const categoryKey =
                            category.coding?.[0]?.code ||
                            category.text?.replace(/\s+/g, '-') ||
                            crypto.randomUUID();

                          return (
                            <Text key={categoryKey} className="text-xs">
                              {category.coding
                                ?.map((coding) => coding.display)
                                .filter(Boolean)
                                .join(', ') ||
                                category.text ||
                                'N/A'}
                            </Text>
                          );
                        })}
                        {!obs?.category?.length && (
                          <Text className="text-sm">N/A</Text>
                        )}
                      </Text>
                    </View>

                    {/* Performer */}
                    <View className="w-1/2 pl-2">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Performer
                      </Text>
                      <Text className="text-xs font-medium dark:text-gray-300">
                        {obs?.performer?.map((performer) => {
                          // Get a stable key from FHIR reference
                          const resourceId = performer.reference
                            ?.split('/')
                            .pop(); // Extracts "123" from "Practitioner/123"
                          const key =
                            resourceId ||
                            performer.display?.replace(/\s+/g, '-') ||
                            crypto.randomUUID();

                          return (
                            <Text key={key} className="text-sm">
                              {performer.display ?? 'N/A'}
                            </Text>
                          );
                        })}
                        {!obs?.performer?.length && (
                          <Text className="text-sm">N/A</Text>
                        )}
                      </Text>
                    </View>

                    {/* interpretation */}
                    <View className="w-1/2 pr-2">
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        Interpretation
                      </Text>
                      <Text className="text-xs font-medium dark:text-gray-200">
                        {getInterpretation(obs?.interpretation)}
                      </Text>
                    </View>
                    {/* Status */}
                    <View className="w-1/2 pr-2">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Status
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <View
                          className={`size-3 rounded-full ${
                            obs?.status === 'final'
                              ? 'bg-green-500 dark:bg-green-400'
                              : 'bg-gray-400 dark:bg-gray-600'
                          }`}
                        />
                        <Text className="text-sm">{obs?.status ?? 'N/A'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default PatientScreen;
