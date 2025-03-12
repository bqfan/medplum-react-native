import React from 'react';

import PatientList from '@/components/patient-list';
import { FocusAwareStatusBar, View } from '@/components/ui';

export default function Patients() {
  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <PatientList />
    </View>
  );
}
