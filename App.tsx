import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import Navigation from './src/navigation';
import { AppProvider } from './src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('App component mounted');
        // アプリの初期化処理
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Navigation />
        </View>
      </AppProvider>
    </ErrorBoundary>
  );
}
