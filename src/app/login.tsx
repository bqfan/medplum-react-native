import {
  getDisplayString,
  type LoginAuthenticationResponse,
} from '@medplum/core';
import {
  useMedplum,
  useMedplumContext,
  useMedplumProfile,
} from '@medplum/react-hooks';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import PatientsScreen from '@/components/patient-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

/* eslint-disable max-lines-per-function */
export default function Login() {
  const medplum = useMedplum();
  const profile = useMedplumProfile();
  const { loading } = useMedplumContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [patients, setPatients] = useState<Patient[]>();
  // const [lastName, setLastName] = useState('');

  function startLogin(): void {
    medplum
      .startLogin({ email, password })
      .then(handleAuthResponse)
      .catch(console.error);
  }

  function handleAuthResponse(response: LoginAuthenticationResponse): void {
    if (response.code) {
      medplum.processCode(response.code).catch(console.error);
    }
    if (response.memberships) {
      // TODO: Handle multiple memberships
      // In a real app, you would present a list of memberships to the user
      // For this example, just use the first membership
      medplum
        .post('auth/profile', {
          login: response.login,
          profile: response.memberships[0].id,
        })
        .then(handleAuthResponse)
        .catch(console.error);
    }
  }

  function signOut(): void {
    medplum.signOut().catch(console.error);
  }

  return (
    <SafeAreaView className="w-full flex-1 items-center justify-center">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text style={styles.title}>Medplum React Native Example</Text>
            <Text style={styles.loginText}>
              {profile && `Logged in as ${getDisplayString(profile)}`}
            </Text>
            {profile && (
              <View style={{ flex: 1 }}>
                <PatientsScreen medplum={medplum} />
              </View>
            )}
            {!profile ? (
              <View style={styles.formWrapper}>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                  />
                </View>
                <Button onPress={startLogin}>
                  <ButtonText>Sign in</ButtonText>
                </Button>
              </View>
            ) : (
              <View style={styles.authedWrapper}>
                <Button onPress={signOut}>
                  <ButtonText>Sign out</ButtonText>
                </Button>
              </View>
            )}
            <StatusBar style="auto" />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// interface NotificationsWidgitProps {
//   title?: string;
//   criteria: string;
// }

// function NotificationsWidgit(props: NotificationsWidgitProps): JSX.Element {
//   const [notifications, setNotifications] = useState(0);
//   const [reconnecting, setReconnecting] = useState(false);

//   useSubscription(
//     props.criteria,
//     () => {
//       setNotifications(notifications + 1);
//     },
//     {
//       onWebSocketClose: useCallback(() => {
//         setReconnecting(true);
//       }, []),
//       onWebSocketOpen: useCallback(() => {
//         if (reconnecting) {
//           setReconnecting(false);
//         }
//       }, [reconnecting]),
//     }
//   );

//   function clearNotifications(): void {
//     setNotifications(0);
//   }

//   return (
//     <View style={styles.marginTop10}>
//       <Text>
//         {props.title ?? 'Notifications:'} {notifications}
//       </Text>
//       <Text>Reconnecting: {reconnecting.toString()}</Text>
//       <Button onPress={clearNotifications}>
//         <ButtonText>Clear</ButtonText>
//       </Button>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  loginText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  formWrapper: {
    marginTop: 10,
  },
  authedWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    minWidth: 200,
    height: 40,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#ced4da',
    color: '#212529',
    marginBottom: 10,
    borderRadius: 6,
  },
  marginTop10: {
    marginTop: 10,
  },
  scrollView: {
    marginTop: 20,
    width: 250,
    paddingHorizontal: 5,
  },
  name: {
    textAlign: 'center',
    marginBottom: 2,
    color: '#212529',
    borderStyle: 'solid',
    borderColor: '#ced4da',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
});
