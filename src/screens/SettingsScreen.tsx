import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';

export default function SettingsScreen() {
  const {
    settings,
    updateSettings,
    resetProgress,
    resetSettings,
    isLoading
  } = useAppContext();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleToggleExplanation = () => {
    updateSettings({ showExplanationImmediately: !settings.showExplanationImmediately });
  };

  const handleToggleShuffle = () => {
    updateSettings({ shuffleOptions: !settings.shuffleOptions });
  };


  const handleResetProgress = () => {
    Alert.alert(
      '進捗をリセット',
      '全ての学習進捗データをリセットします。この操作は元に戻せません。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'リセット',
          style: 'destructive',
          onPress: () => resetProgress(),
        },
      ],
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      '設定をリセット',
      '全ての設定をデフォルトに戻します。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'リセット',
          onPress: () => resetSettings(),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>データを読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>クイズ設定</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>即時解説表示</Text>
            <Text style={styles.settingDescription}>
              回答直後に解説を表示します
            </Text>
          </View>
          <Switch
            value={settings.showExplanationImmediately}
            onValueChange={handleToggleExplanation}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.showExplanationImmediately ? '#0066cc' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>選択肢をシャッフル</Text>
            <Text style={styles.settingDescription}>
              問題ごとに選択肢の順番をランダム化します
            </Text>
          </View>
          <Switch
            value={settings.shuffleOptions}
            onValueChange={handleToggleShuffle}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.shuffleOptions ? '#0066cc' : '#f4f3f4'}
          />
        </View>
      </View>



      <View style={styles.section}>
        <Text style={styles.sectionTitle}>データ管理</Text>
        
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetProgress}
        >
          <Text style={styles.resetButtonText}>学習進捗をリセット</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.resetButton, styles.resetSettingsButton]}
          onPress={handleResetSettings}
        >
          <Text style={styles.resetButtonText}>設定をリセット</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリ情報</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>バージョン</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>問題数</Text>
          <Text style={styles.infoValue}>500問（予定）</Text>
        </View>
        
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>プライバシーポリシー</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={styles.linkButtonText}>お問い合わせ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  resetSettingsButton: {
    backgroundColor: '#6c757d',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  linkButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkButtonText: {
    fontSize: 16,
    color: '#0066cc',
  },
});
