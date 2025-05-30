import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, DomainMap } from '../types';
import { useAppContext } from '../context/AppContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const domains = [
  { id: 'cloud-concepts', name: 'クラウドの概念' },
  { id: 'technology', name: 'テクノロジー' },
  { id: 'security', name: 'セキュリティとコンプライアンス' },
  { id: 'billing-pricing', name: '請求と料金' }
];

export default function HomeScreen({ navigation }: Props) {
  const { userProgress, isLoading } = useAppContext();
  
  const totalAnswered = userProgress?.totalQuestionsAnswered || 0;
  const totalCorrect = userProgress?.totalCorrectAnswers || 0;
  const correctPercentage = totalAnswered > 0 
    ? Math.round((totalCorrect / totalAnswered) * 100) 
    : 0;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AWS CLF 試験対策アプリ</Text>
      </View>
      
      {!isLoading && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>学習進捗</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{totalAnswered}</Text>
              <Text style={styles.progressLabel}>解答済み</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{correctPercentage}%</Text>
              <Text style={styles.progressLabel}>正答率</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{userProgress?.studyStreak || 0}</Text>
              <Text style={styles.progressLabel}>連続日数</Text>
            </View>
          </View>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Text style={styles.sectionTitle}>学習モード</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Quiz', { mode: 'single' })}
        >
          <Text style={styles.buttonText}>一問一答</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>分野別一問一答</Text>
        {domains.map((domain) => (
          <TouchableOpacity
            key={domain.id}
            style={styles.domainButton}
            onPress={() => navigation.navigate('Quiz', { 
              mode: 'domain', 
              domainFilter: domain.id 
            })}
          >
            <Text style={styles.buttonText}>{domain.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, styles.fullTestButton]}
          onPress={() => navigation.navigate('Quiz', { mode: 'full' })}
        >
          <Text style={styles.buttonText}>総合問題</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.mockExamButton]}
          onPress={() => navigation.navigate('MockExam')}
        >
          <Text style={styles.buttonText}>模擬試験</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>復習モード</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.reviewButton]}
          onPress={() => navigation.navigate('Quiz', { mode: 'bookmarked' })}
        >
          <Text style={styles.buttonText}>ブックマーク問題</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.reviewButton]}
          onPress={() => navigation.navigate('Quiz', { mode: 'incorrect' })}
        >
          <Text style={styles.buttonText}>間違えた問題</Text>
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
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 15,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  domainButton: {
    backgroundColor: '#4d94ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  fullTestButton: {
    backgroundColor: '#003366',
    marginTop: 10,
  },
  mockExamButton: {
    backgroundColor: '#28a745',
    marginTop: 10,
  },
  reviewButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
});
