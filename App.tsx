import React, { useEffect, useCallback, useState } from 'react';
import { View } from 'react-native';
import Navigation from './src/navigation';
import { AppProvider } from './src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';

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

    // フォールバック：最大5秒後には必ずSplashScreenを非表示にする
    const fallbackTimer = setTimeout(() => {
      console.log('⚠️ Fallback: Force hiding splash screen after 5s');
      setAppIsReady(true);
      SplashScreen.hideAsync().catch(console.warn);
    }, 5000);

    prepare().finally(() => {
      clearTimeout(fallbackTimer);
    });

    return () => clearTimeout(fallbackTimer);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        console.log('🔄 Attempting to hide splash screen');
        await SplashScreen.hideAsync();
        console.log('✅ Splash screen hidden successfully');
      } catch (error) {
        console.error('❌ Failed to hide splash screen:', error);
        // エラーが発生してもUI表示は続行
      }
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
