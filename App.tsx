import React, { useEffect, useCallback, useState } from 'react';
import { View, AppState } from 'react-native';
import Navigation from './src/navigation';
import { AppProvider } from './src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';

// SplashScreenの自動非表示を防止
SplashScreen.preventAutoHideAsync().catch(console.warn);

// 即座にフォールバック用のタイマーを設定（グローバルレベル）
setTimeout(async () => {
  console.log('🚨 GLOBAL FALLBACK: Force hiding splash screen after 10s');
  try {
    await SplashScreen.hideAsync();
    console.log('✅ Global fallback: Splash screen hidden');
  } catch (error) {
    console.error('❌ Global fallback failed:', error);
  }
}, 10000);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);

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
        
        // 初期化完了と同時にSplashScreenを非表示
        setTimeout(async () => {
          try {
            console.log('🔄 Attempting to hide splash screen');
            await SplashScreen.hideAsync();
            setSplashHidden(true);
            console.log('✅ Splash screen hidden successfully');
          } catch (error) {
            console.error('❌ Failed to hide splash screen:', error);
            setSplashHidden(true); // エラーでも状態更新
          }
        }, 100); // 少し遅延させてUIの準備を待つ
      }
    }

    // フォールバック：最大3秒後には必ずSplashScreenを非表示にする
    const fallbackTimer = setTimeout(async () => {
      console.log('⚠️ Fallback: Force hiding splash screen after 3s');
      setAppIsReady(true);
      try {
        await SplashScreen.hideAsync();
        setSplashHidden(true);
        console.log('✅ Fallback splash screen hidden');
      } catch (error) {
        console.error('❌ Fallback hide failed:', error);
        setSplashHidden(true); // エラーでも状態更新
      }
    }, 3000);

    prepare().finally(() => {
      clearTimeout(fallbackTimer);
    });

    return () => clearTimeout(fallbackTimer);
  }, []);

  const onLayoutRootView = useCallback(() => {
    console.log('📱 Main UI layout complete');
  }, []);

  // アプリの準備ができるまで何も表示しない
  if (!appIsReady) {
    console.log('⏳ App not ready, showing splash screen');
    return null;
  }

  console.log('🎉 Rendering main app, splash hidden:', splashHidden);
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
