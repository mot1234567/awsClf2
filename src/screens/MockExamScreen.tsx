import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { Question, RootStackParamList, MockExamResult } from '../types';

import sampleQuestions from '../data/sampleQuestions.json';

type MockExamScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MockExam'>;

export default function MockExamScreen() {
  const navigation = useNavigation<MockExamScreenNavigationProp>();
  const { saveMockExamResult } = useAppContext();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const allQuestions = [...sampleQuestions] as Question[];
    
    const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    
    const examQuestions = shuffledQuestions.slice(0, Math.min(65, shuffledQuestions.length));
    
    setQuestions(examQuestions);
    setAnswers(new Array(examQuestions.length).fill(null));
  }, []);

  useEffect(() => {
    if (examStarted && !examCompleted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleExamComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      startTimeRef.current = Date.now();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examStarted, examCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleExamComplete = async () => {
    setExamCompleted(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    let score = 0;
    const domainScores: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach((question, index) => {
      if (!domainScores[question.domain]) {
        domainScores[question.domain] = { correct: 0, total: 0 };
      }
      
      domainScores[question.domain].total += 1;
      
      if (answers[index] === question.correctAnswer) {
        score += 1;
        domainScores[question.domain].correct += 1;
      }
    });
    
    const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    const mockExamId = `mock-${Date.now()}`;
    const result: MockExamResult = {
      id: mockExamId,
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      timeSpentSeconds,
      domainScores
    };
    
    await saveMockExamResult(result);
    
    navigation.navigate('MockExamResult', { mockExamId });
  };

  const confirmSubmit = () => {
    const unansweredCount = answers.filter(a => a === null).length;
    
    if (unansweredCount > 0) {
      Alert.alert(
        '未回答の問題があります',
        `${unansweredCount}問が未回答です。このまま終了しますか？`,
        [
          {
            text: 'キャンセル',
            style: 'cancel'
          },
          {
            text: '終了する',
            onPress: handleExamComplete
          }
        ]
      );
    } else {
      handleExamComplete();
    }
  };

  if (!examStarted) {
    return (
      <View style={styles.container}>
        <View style={styles.examInfoCard}>
          <Text style={styles.examTitle}>AWS CLF 模擬試験</Text>
          <Text style={styles.examInfo}>
            • 問題数: 65問{'\n'}
            • 制限時間: 90分{'\n'}
            • 合格ライン: 70%以上
          </Text>
          <Text style={styles.examDescription}>
            この模擬試験は実際のAWS認定クラウドプラクティショナー試験と同様の形式で出題されます。
            時間内にすべての問題に回答してください。
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartExam}
          >
            <Text style={styles.startButtonText}>試験を開始する</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>問題を読み込み中...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>
          残り時間: {formatTime(timeRemaining)}
        </Text>
        <Text style={styles.progress}>
          {answeredCount}/{questions.length}問回答済み
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            問題 {currentQuestionIndex + 1} / {questions.length}
          </Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  currentAnswer === index && styles.selectedOption
                ]}
                onPress={() => handleSelectOption(index)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>前の問題</Text>
        </TouchableOpacity>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={confirmSubmit}
          >
            <Text style={styles.navButtonText}>終了する</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.navButtonText}>次の問題</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  examInfoCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  examTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  examInfo: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  examDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc', // Color will be dynamically set in the component
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  questionContainer: {
    padding: 15,
  },
  questionNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e6f2ff',
    borderColor: '#0066cc',
  },
  optionText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
});
