import type { LoginAuthenticationResponse } from '@medplum/core';
import { useMedplum } from '@medplum/react-hooks';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const medplum = useMedplum();
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [_, setError] = useState<string | null>(null); // Add error state

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    setError(null); // Reset error state on new submission
    console.log('Login attempt with:', data);

    medplum
      .startLogin({ email: data.email, password: data.password })
      .then(handleAuthResponse)
      .catch((error) => {
        // Proper error handling
        console.error('Login failed:', error);
        setError(getErrorMessage(error)); // Set user-friendly error
      });
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

  // Helper function to extract error message
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
