import * as React from 'react';

import { Colors } from '@/components/colors';
import { Inputs } from '@/components/inputs';
import { Typography } from '@/components/typography';
import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/components/ui';

export default function Style() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          <Typography />
          <Colors />
          <Inputs />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
