import { Env } from '@env';
import { MedplumClient } from '@medplum/core';
import {
  ExpoClientStorage,
  initWebSocketManager,
  polyfillMedplumWebAPIs,
} from '@medplum/expo-polyfills';

// This is a module to get the Medplum client working on React Native by polyfilling a few Web APIs that are missing from the React Native runtime
// On web, the polyfill function is loaded but nothing is replaced
polyfillMedplumWebAPIs();

export const medplum_client = new MedplumClient({
  // Enter your Medplum connection details here
  // See MedplumClient docs for more details
  // baseUrl: 'http://localhost:8103',
  baseUrl: Env.MEDPLUM_BASE_URL,
  // ------------------------------------------------------------------------------
  // If you are testing this out with your physical Android / iOS device and not an emulator,
  // you will need to put your computer's local IP address here, for example:
  // baseUrl: 'http://192.168.x.x:8103'
  // Metro will usually emit this address in the line: 'Metro waiting on exp://192.168.1.216:8081'
  // but you will need to change the protocol to 'http://' and the port to 8103 (the Medplum server's default) or whatever port your server is using
  // ------------------------------------------------------------------------------
  // clientId: 'MY_CLIENT_ID',
  clientId: '0195b69b-f52e-7209-b8d1-a58550616c86',
  // projectId: 'MY_PROJECT_ID',
  storage: new ExpoClientStorage(),
});

initWebSocketManager(medplum_client);
