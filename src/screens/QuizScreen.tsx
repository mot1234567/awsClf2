import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Question, QuizMode, DomainMap } from '../types';
import { useAppContext } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';

import sampleQuestions from '../data/sampleQuestions.json';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

type Props = {
  navigation: QuizScreenNavigationProp;
  route: QuizScreenRouteProp;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
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
  bookmarkButton: {
    padding: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  questionContainer: {
    padding: 20,
  },
  questionCount: {
    fontSize: 16,
    color: '#666',
  },
  domainTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
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
  correctOption: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  incorrectOption: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  optionText: {
    fontSize: 16,
  },
  explanationContainer: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function QuizScreen({ navigation, route }: Props) {
  const { mode, domainFilter, questionId } = route.params;
  const { 
    questionHistory, 
    settings, 
    bookmarkQuestion, 
    updateQuestionHistory 
  } = useAppContext();
  
  const isMounted = useRef(true);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
      
      loadQuestions();
      
      return () => {
        isMounted.current = false;
      };
    }, [mode, domainFilter, questionId, settings.shuffleOptions])
  );
  
  const loadQuestions = useCallback(() => {
    setIsLoading(true);
    
    try {
      let filteredQuestions = [...sampleQuestions] as Question[];
      
      if (mode === 'domain' && domainFilter) {
        filteredQuestions = filteredQuestions.filter(
          q => q.domain === DomainMap[domainFilter]
        );
      } else if (mode === 'bookmarked') {
        filteredQuestions = filteredQuestions.filter(q => 
          questionHistory[q.id]?.bookmarked
        );
      } else if (mode === 'incorrect') {
        filteredQuestions = filteredQuestions.filter(q => {
          const history = questionHistory[q.id];
          return history && history.attempts > 0 && 
                history.correctAttempts < history.attempts;
        });
      } else if (mode === 'single' && questionId) {
        filteredQuestions = filteredQuestions.filter(q => q.id === questionId);
      }
      
      if (settings.shuffleOptions && mode !== 'single') {
        filteredQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
      }

      if (mode === 'single' && !questionId) {
        filteredQuestions = [...filteredQuestions]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(10, filteredQuestions.length));
      } else if (mode === 'domain') {
        filteredQuestions = [...filteredQuestions]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(10, filteredQuestions.length));
      }
      
      if (isMounted.current) {
        setQuestions(filteredQuestions);
        setIsLoading(false);
        
        if (filteredQuestions.length > 0) {
          const currentQuestion = filteredQuestions[0];
          setIsBookmarked(!!questionHistory[currentQuestion.id]?.bookmarked);
        }
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      if (isMounted.current) {
        setIsLoading(false);
        Alert.alert('エラー', '問題の読み込み中にエラーが発生しました。');
      }
    }
  }, [mode, domainFilter, questionId, settings.shuffleOptions]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setIsBookmarked(!!questionHistory[currentQuestion.id]?.bookmarked);
    }
  }, [currentQuestionIndex, questions, questionHistory]);

  const handleToggleBookmark = async () => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      await bookmarkQuestion(question.id, !isBookmarked);
      if (isMounted.current) {
        setIsBookmarked(!isBookmarked);
      }
    }
  };

  const handleOptionSelect = async (optionIndex: number) => {
    if (!isMounted.current) return;
    
    setSelectedOption(optionIndex);
    
    if (settings.showExplanationImmediately) {
      setShowExplanation(true);
    }
    
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = optionIndex === currentQuestion.correctAnswer;
      
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }
      
      await updateQuestionHistory(
        currentQuestion.id,
        isCorrect
      );
    }
  };

  const handleNextQuestion = () => {
    if (!isMounted.current) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      navigation.navigate('Result', {
        score,
        total: questions.length
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>問題を読み込み中...</Text>
      </View>
    );
  }
  
  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {mode === 'bookmarked' 
            ? 'ブックマークした問題はありません。問題画面で星マークをタップすると、ブックマークに追加されます。'
            : mode === 'incorrect'
              ? '間違えた問題はありません。問題を解いて復習しましょう。'
              : '問題が見つかりませんでした。'}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>問題の読み込みエラーが発生しました。</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCount}>
          問題 {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.questionContainer}>
          <QuestionCard
            question={currentQuestion}
            selectedOption={selectedOption}
            isBookmarked={isBookmarked}
            showExplanation={showExplanation}
            onSelectOption={handleOptionSelect}
            onToggleBookmark={handleToggleBookmark}
          />
        </View>
      </ScrollView>
      
      {selectedOption !== null && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextQuestion}
            testID="next-question-button"
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < questions.length - 1 ? '次の問題' : '結果を見る'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
