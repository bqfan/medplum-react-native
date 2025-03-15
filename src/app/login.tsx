import type { LoginAuthenticationResponse } from '@medplum/core';
import { useMedplum } from '@medplum/react-hooks';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import type { LoginFormValues } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';

/* eslint-disable max-lines-per-function */
export default function Login() {
  const medplum = useMedplum();
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [_, setError] = useState<string | null>(null); // Add error state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await medplum
        .startLogin({
          email: values.email,
          password: values.password,
        })
        .then(handleAuthResponse);
    } catch (error) {
      // Proper error handling
      console.error('Login failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';

      // Reset errors
      setEmailError('');
      setPasswordError('');

      // Map server errors
      if (errorMessage.includes('User not found')) {
        setEmailError(errorMessage);
      } else if (
        errorMessage.includes('Invalid password') ||
        errorMessage.includes('Email or password')
      ) {
        setPasswordError('Invalid password');
      }
    }
  };

  function handleAuthResponse(response: LoginAuthenticationResponse): void {
    if (response.code) {
      medplum
        .processCode(response.code)
        .then(() => {
          // Only sign in and redirect after successful authentication
          signIn({ access: 'access-token', refresh: 'refresh-token' });
          router.push('/');
        })
        .catch((error) => {
          console.error('Code processing failed:', error);
          setError('Authentication failed. Please try again.');
        });
    }
    if (response.memberships) {
      medplum
        .post('auth/profile', {
          login: response.login,
          profile: response.memberships[0].id,
        })
        .then(handleAuthResponse)
        .catch((error) => {
          console.error('Profile selection failed:', error);
          setError('Profile selection failed. Please try again.');
        });
    }
  }

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm
        onSubmit={onSubmit}
        emailError={emailError}
        passwordError={passwordError}
      />
    </>
  );
}
