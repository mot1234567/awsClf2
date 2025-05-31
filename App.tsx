import React, { useEffect } from 'react';
import Navigation from './src/navigation';
import { AppProvider } from './src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <StatusBar style="auto" />
        <Navigation />
      </AppProvider>
    </ErrorBoundary>
  );
}
