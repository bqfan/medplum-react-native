/* eslint-disable max-lines-per-function */
import * as React from 'react';

import { Image } from '@/components/ui';

export const Cover = () => (
  <Image
    className="h-24 w-screen overflow-hidden rounded-t-xl"
    contentFit="cover"
    source={require('../../assets/medplum-logo.png')}
  />
);
