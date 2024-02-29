import '@aws-amplify/ui-react/styles.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Amplify } from 'aws-amplify';
import { Inter } from 'next/font/google';
import './globals.css';
import config from './src/amplifyconfiguration.json';
import type { Metadata } from 'next';

if (config) {
  Amplify.configure(config);
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
