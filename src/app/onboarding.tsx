import { useRouter } from 'expo-router';
import React from 'react';

import { Cover } from '@/components/cover';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center">
      <FocusAwareStatusBar />
      <View className="mb-2 text-center text-lg">
        <Cover />
      </View>
      <View className="justify-end ">
        <Text className="mb-2 text-center text-lg text-gray-600">
          Welcome to Medplum
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">
          🏥 Open source healthcare platform
        </Text>
        <Text className="my-1 text-left text-lg">
          👨‍⚕️ API-first headless EHR
        </Text>
        <Text className="my-1 text-left text-lg">
          🩺 FHIR-native for Interoperability
        </Text>
        <Text className="my-1 text-left text-lg">
          💊 Secure & Compliant
        </Text>
        <Text className="my-1 text-left text-lg">
        💉 For any services & applications
        </Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Let's Get Started "
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
