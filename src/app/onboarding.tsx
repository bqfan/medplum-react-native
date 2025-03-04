import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center">
      <FocusAwareStatusBar />
      <SafeAreaView className="w-full flex-1 items-center justify-center">
        <Image
          source={require('../../assets/images/fhir-splash-icon.png')}
          style={{
            width: width * 0.8,
            height: width * 0.8,
          }}
          resizeMode="contain"
        />
      </SafeAreaView>
      <View className="justify-end ">
        <Text className="my-3 text-center text-3xl font-bold">
          FHIR React Native
        </Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          🔥HL7 Fast Healthcare Interoperability Resources (FHIR)
        </Text>

        <Text className="my-1 pt-6 text-center text-base">
          🏥 A modern standard for healthcare data exchange
        </Text>
        <Text className="my-1 text-center text-base">
          🩻 Integration with EHRs, apps, and cloud systems
        </Text>
        <Text className="my-1 text-center text-base">
          🌐 Scalability, security, and regulatory compliance
        </Text>
        <Text className="my-1 text-center text-base">
          👨‍⚕️ Care coordination, patient engagement
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
