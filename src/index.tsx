// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';

import { Amplify } from 'aws-amplify';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import awsconfig from './aws-exports';
import reportWebVitals from './reportWebVitals';

Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

reportWebVitals().catch((error) => {
  console.error('Failed to report web vitals', error);
});
