import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, MockExamResult } from '../types';

type MockExamResultScreenRouteProp = RouteProp<RootStackParamList, 'MockExamResult'>;
type MockExamResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MockExamResult'>;

type Props = {
  route: MockExamResultScreenRouteProp;
};

export default function MockExamResultScreen({ route }: Props) {
  const { mockExamId } = route.params;
  const navigation = useNavigation<MockExamResultScreenNavigationProp>();
  const { userProgress } = useAppContext();
  
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = userProgress.mockExamHistory.find(exam => exam.id === mockExamId);
    
    if (result) {
      setExamResult(result);
    }
    
    setLoading(false);
  }, [mockExamId, userProgress]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>結果を読み込み中...</Text>
      </View>
    );
  }

  if (!examResult) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>試験結果が見つかりませんでした。</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>ホームに戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const percentage = Math.round((examResult.score / examResult.totalQuestions) * 100);
  const isPassing = percentage >= 70; // AWS CLF passing score is typically 70%
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>模擬試験結果</Text>
        <Text style={[
          styles.resultScore,
          isPassing ? styles.passingScore : styles.failingScore
        ]}>
          {percentage}%
        </Text>
        <Text style={styles.resultDetail}>
          {examResult.score}/{examResult.totalQuestions}問正解
        </Text>
        <Text style={[
          styles.resultStatus,
          isPassing ? styles.passingStatus : styles.failingStatus
        ]}>
          {isPassing ? '合格' : '不合格'}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>試験情報</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>日時</Text>
          <Text style={styles.infoValue}>
            {new Date(examResult.date).toLocaleDateString('ja-JP')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>所要時間</Text>
          <Text style={styles.infoValue}>
            {formatTime(examResult.timeSpentSeconds)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>合格ライン</Text>
          <Text style={styles.infoValue}>70%</Text>
        </View>
      </View>

      <View style={styles.domainCard}>
        <Text style={styles.domainTitle}>分野別スコア</Text>
        
        {Object.entries(examResult.domainScores).map(([domain, scores]) => {
          const domainPercentage = Math.round((scores.correct / scores.total) * 100);
          
          return (
            <View key={domain} style={styles.domainItem}>
              <View style={styles.domainHeader}>
                <Text style={styles.domainName}>{domain}</Text>
                <Text style={styles.domainPercentage}>{domainPercentage}%</Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${domainPercentage}%` },
                    domainPercentage >= 70 ? styles.passingBar : styles.failingBar
                  ]} 
                />
              </View>
              
              <Text style={styles.domainDetail}>
                {scores.correct}/{scores.total}問正解
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackTitle}>フィードバック</Text>
        <Text style={styles.feedbackText}>
          {isPassing 
            ? '素晴らしい結果です！実際の試験でも同様の成績を期待できます。引き続き弱点分野を復習して、本番に備えましょう。'
            : '合格ラインに達していません。特に正答率の低い分野を重点的に復習し、再度模擬試験に挑戦してください。'}
        </Text>
        
        {!isPassing && (
          <Text style={styles.improvementText}>
            改善が必要な分野:
            {Object.entries(examResult.domainScores)
              .filter(([_, scores]) => (scores.correct / scores.total) < 0.7)
              .map(([domain, _]) => ` ${domain}`)
              .join('、')}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>ホームに戻る</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.retryButton]}
          onPress={() => navigation.navigate('MockExam')}
        >
          <Text style={styles.buttonText}>もう一度挑戦</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 20,
  },
  resultHeader: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  passingScore: {
    color: '#28a745',
  },
  failingScore: {
    color: '#dc3545',
  },
  resultDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  resultStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
  },
  passingStatus: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  failingStatus: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  domainCard: {
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
  domainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  domainItem: {
    marginBottom: 15,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainName: {
    fontSize: 16,
    fontWeight: '600',
  },
  domainPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  passingBar: {
    backgroundColor: '#28a745',
  },
  failingBar: {
    backgroundColor: '#dc3545',
  },
  domainDetail: {
    fontSize: 14,
    color: '#666',
  },
  feedbackCard: {
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
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  improvementText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
  },
  buttonContainer: {
    margin: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#28a745',
  },
});
