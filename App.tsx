import React, { useEffect, useCallback, useState } from 'react';
import { View, AppState, LogBox } from 'react-native';
import Navigation from './src/navigation';
import { AppProvider } from './src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';

LogBox.ignoreLogs(['SplashScreen']); // ignore benign splash warnings

// SplashScreenの自動非表示を防止
SplashScreen.preventAutoHideAsync().catch(console.warn);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('🚀 App initialization started');
        
        // フォント読み込み（必要に応じて）
        // await Font.loadAsync({...});
        
        // データ初期化処理
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ App initialization completed');
        
      } catch (e) {
        console.error('❌ App initialization failed:', e);
        // エラーが発生してもアプリを続行
      } finally {
        console.log('🎯 Setting app as ready');
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    console.log('📱 Main UI layout complete');
    if (appIsReady) {
      SplashScreen.hideAsync()
        .then(() => {
          console.log('✅ Splash screen hidden from onLayout');
        })
        .catch(err => console.error('❌ Failed to hide splash from onLayout:', err));
    }
  }, [appIsReady]);

  // アプリの準備ができるまで何も表示しない
  if (!appIsReady) {
    console.log('⏳ App not ready, showing splash screen');
    return null;
  }

  console.log('🎉 Rendering main app');
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
