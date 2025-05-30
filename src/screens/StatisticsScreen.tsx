import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { DomainMap } from '../types';

export default function StatisticsScreen() {
  const { userProgress, questionHistory, isLoading } = useAppContext();
  const [domainStats, setDomainStats] = useState<{
    domain: string;
    percentage: number;
    answered: number;
    total: number;
  }[]>([]);

  useEffect(() => {
    if (!isLoading) {
      const stats = Object.entries(userProgress.domainProgress)
        .filter(([domain, progress]) => progress.total > 0) // 0問の分野を除外
        .map(([domain, progress]) => {
          const percentage = progress.total > 0 
            ? Math.round((progress.correct / progress.total) * 100) 
            : 0;
          
          return {
            domain,
            percentage,
            answered: progress.answered,
            total: progress.total
          };
        });
      
      setDomainStats(stats);
    }
  }, [userProgress, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>データを読み込み中...</Text>
      </View>
    );
  }

  const totalAnswered = userProgress.totalQuestionsAnswered;
  const totalCorrect = userProgress.totalCorrectAnswers;
  const overallPercentage = totalAnswered > 0 
    ? Math.round((totalCorrect / totalAnswered) * 100) 
    : 0;
  
  const mockExams = userProgress.mockExamHistory || [];
  const latestMockExam = mockExams.length > 0 
    ? mockExams[mockExams.length - 1] 
    : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学習概要</Text>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>総合正答率</Text>
          <Text style={styles.statValue}>{overallPercentage}%</Text>
          <Text style={styles.statDetail}>
            {totalAnswered}問中{totalCorrect}問正解
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>学習継続日数</Text>
          <Text style={styles.statValue}>{userProgress.studyStreak}日</Text>
          <Text style={styles.statDetail}>
            {userProgress.lastStudyDate ? `最終学習日: ${new Date(userProgress.lastStudyDate).toLocaleDateString('ja-JP')}` : '学習を始めましょう！'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分野別進捗</Text>
        
        {domainStats.map((stat) => (
          <View key={stat.domain} style={styles.domainCard}>
            <View style={styles.domainHeader}>
              <Text style={styles.domainName}>
                {Object.entries(DomainMap).find(([_, value]) => value === stat.domain)?.[0] || stat.domain}
              </Text>
              <Text style={styles.domainPercentage}>{stat.percentage}%</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${stat.percentage}%` }
                ]} 
              />
            </View>
            
            <Text style={styles.domainDetail}>
              {stat.answered}/{stat.total}問解答済み
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>模擬試験履歴</Text>
        
        {mockExams.length === 0 ? (
          <Text style={styles.emptyMessage}>
            まだ模擬試験を受けていません。ホーム画面から模擬試験に挑戦しましょう！
          </Text>
        ) : (
          mockExams.map((exam) => (
            <View key={exam.id} style={styles.examCard}>
              <View style={styles.examHeader}>
                <Text style={styles.examDate}>
                  {new Date(exam.date).toLocaleDateString('ja-JP')}
                </Text>
                <Text style={styles.examScore}>
                  {Math.round((exam.score / exam.totalQuestions) * 100)}%
                </Text>
              </View>
              
              <Text style={styles.examDetail}>
                {exam.score}/{exam.totalQuestions}問正解 ({Math.floor(exam.timeSpentSeconds / 60)}分{exam.timeSpentSeconds % 60}秒)
              </Text>
              
              <View style={styles.domainScores}>
                {Object.entries(exam.domainScores).map(([domain, scores]) => (
                  <Text key={domain} style={styles.domainScore}>
                    {domain}: {scores.correct}/{scores.total}
                  </Text>
                ))}
              </View>
            </View>
          ))
        )}
        
        {latestMockExam && (
          <View style={styles.latestExamCard}>
            <Text style={styles.latestExamTitle}>最新の模擬試験結果</Text>
            <Text style={styles.latestExamScore}>
              {Math.round((latestMockExam.score / latestMockExam.totalQuestions) * 100)}%
            </Text>
            <Text style={styles.latestExamDetail}>
              {latestMockExam.score >= (latestMockExam.totalQuestions * 0.7) 
                ? '合格ラインに達しています！' 
                : 'もう少し頑張りましょう！'}
            </Text>
          </View>
        )}
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
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginVertical: 5,
  },
  statDetail: {
    fontSize: 14,
    color: '#666',
  },
  domainCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  domainName: {
    fontSize: 16,
    fontWeight: '600',
  },
  domainPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0066cc',
    borderRadius: 4,
  },
  domainDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  examCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examDate: {
    fontSize: 14,
    color: '#666',
  },
  examScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  examDetail: {
    fontSize: 14,
    marginVertical: 5,
  },
  domainScores: {
    marginTop: 5,
  },
  domainScore: {
    fontSize: 12,
    color: '#666',
  },
  latestExamCard: {
    backgroundColor: '#e6f2ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  latestExamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  latestExamScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
    marginVertical: 5,
  },
  latestExamDetail: {
    fontSize: 14,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});
