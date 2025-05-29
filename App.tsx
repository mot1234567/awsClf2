import React from 'react';
import Navigation from './src/navigation';
import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
}
