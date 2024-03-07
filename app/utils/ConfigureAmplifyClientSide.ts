'use client';

import { Amplify } from 'aws-amplify';
import config from '../src/amplifyconfiguration.json';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Amplify.configure(config, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
