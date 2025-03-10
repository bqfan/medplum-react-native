// import { useRouter } from 'expo-router';
// import React from 'react';

// import type { LoginFormProps } from '@/components/login-form';
// import { LoginForm } from '@/components/login-form';
// import { FocusAwareStatusBar } from '@/components/ui';
// import { useAuth } from '@/lib';

// export default function Login() {
//   const router = useRouter();
//   const signIn = useAuth.use.signIn();

//   const onSubmit: LoginFormProps['onSubmit'] = (data) => {
//     console.log(data);
//     signIn({ access: 'access-token', refresh: 'refresh-token' });
//     router.push('/');
//   };
//   return (
//     <>
//       <FocusAwareStatusBar />
//       <LoginForm onSubmit={onSubmit} />
//     </>
//   );
// }
import type { LoginAuthenticationResponse } from '@medplum/core';
import { getDisplayString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import {
  useMedplum,
  useMedplumContext,
  useMedplumProfile,
  useSubscription,
} from '@medplum/react-hooks';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

/* eslint-disable max-lines-per-function */
export default function Login() {
  const medplum = useMedplum();
  const profile = useMedplumProfile();
  const { loading } = useMedplumContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patients, setPatients] = useState<Patient[]>();
  const [lastName, setLastName] = useState('');

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

  function createNewMary(): void {
    medplum
      .createResource<Patient>({
        resourceType: 'Patient',
        name: [
          {
            family: lastName !== '' ? lastName : 'Doe',
            given: ['Mary'],
          },
        ],
      })
      .then((patient) => console.log('Patient created', patient))
      .catch(console.error);
    setLastName('');
  }

  function searchPatient(): void {
    medplum
      //.searchResources('Patient', 'name=Mary')
      .search('Patient')
      .then((response) =>
        setPatients(response.entry?.map((e) => e.resource as Patient))
      )
      .catch(console.error);
  }

  // function searchForMary(): void {
  //   medplum
  //     .searchResources('Patient', 'name=Mary')
  //     .then(setPatients)
  //     .catch(console.error);
  // }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={styles.title}>Medplum React Native Example</Text>
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
              <Text style={styles.loginText}>
                Logged in as {getDisplayString(profile)}
              </Text>
              <Button onPress={signOut}>
                <ButtonText>Sign out</ButtonText>
              </Button>
              <View style={styles.marginTop10}>
                <TextInput
                  style={{ ...styles.input, marginTop: 10 }}
                  placeholder="Mary's Last Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={(lastName) => setLastName(lastName)}
                  value={lastName}
                />
                <Button onPress={createNewMary}>
                  <ButtonText>Create New Mary</ButtonText>
                </Button>
                <Button style={styles.marginTop10} onPress={searchPatient}>
                  <ButtonText>Search Patient</ButtonText>
                </Button>
                <ScrollView style={styles.scrollView}>
                  <View style={styles.marginTop10}>
                    {patients &&
                      (patients.length ? (
                        patients.map((patient) => {
                          const lastName = patient.name?.[0]?.family;
                          const firstName = patient.name?.[0]?.given?.[0];
                          return (
                            <Text
                              key={patient.id as string}
                              style={styles.name}
                            >
                              {firstName} {lastName}
                            </Text>
                          );
                        })
                      ) : (
                        <Text>No patients with first name "Mary" found.</Text>
                      ))}
                  </View>
                </ScrollView>
              </View>
              <NotificationsWidgit
                title="New Marys created:"
                criteria="Patient?name=Mary"
              />
            </View>
          )}
          <StatusBar style="auto" />
        </>
      )}
    </View>
  );
}

interface NotificationsWidgitProps {
  title?: string;
  criteria: string;
}

function NotificationsWidgit(props: NotificationsWidgitProps): JSX.Element {
  const [notifications, setNotifications] = useState(0);
  const [reconnecting, setReconnecting] = useState(false);

  useSubscription(
    props.criteria,
    () => {
      setNotifications(notifications + 1);
    },
    {
      onWebSocketClose: useCallback(() => {
        setReconnecting(true);
      }, []),
      onWebSocketOpen: useCallback(() => {
        if (reconnecting) {
          setReconnecting(false);
        }
      }, [reconnecting]),
    }
  );

  function clearNotifications(): void {
    setNotifications(0);
  }

  return (
    <View style={styles.marginTop10}>
      <Text>
        {props.title ?? 'Notifications:'} {notifications}
      </Text>
      <Text>Reconnecting: {reconnecting.toString()}</Text>
      <Button onPress={clearNotifications}>
        <ButtonText>Clear</ButtonText>
      </Button>
    </View>
  );
}

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
    marginTop: 10,
    height: '60%',
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
