import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

import sampleQuestions from '../data/sampleQuestions.json';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

type Props = {
  navigation: QuizScreenNavigationProp;
  route: QuizScreenRouteProp;
};

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: string;
  difficulty: string;
};

export default function QuizScreen({ navigation, route }: Props) {
  const { mode, domainFilter } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let filteredQuestions = [...sampleQuestions] as Question[];
    
    if (mode === 'domain' && domainFilter) {
      const domainMap: Record<string, string> = {
        'cloud-concepts': 'Cloud Concepts',
        'technology': 'Technology',
        'security': 'Security',
        'billing-pricing': 'Billing and Pricing'
      };
      
      filteredQuestions = filteredQuestions.filter(
        q => q.domain === domainMap[domainFilter]
      );
    }
    
    filteredQuestions.sort(() => Math.random() - 0.5);
    
    if (mode === 'single') {
      filteredQuestions = filteredQuestions.slice(0, 1);
    } else if (mode === 'domain') {
      filteredQuestions = filteredQuestions.slice(0, 5);
    }
    
    setQuestions(filteredQuestions);
  }, [mode, domainFilter]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    
    if (optionIndex === questions[currentQuestionIndex]?.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      navigation.navigate('Result', {
        score,
        total: questions.length
      });
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionCount}>
          問題 {currentQuestionIndex + 1} / {questions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && 
                  (index === currentQuestion.correctAnswer 
                    ? styles.correctOption 
                    : styles.incorrectOption),
                selectedOption !== null && 
                  index === currentQuestion.correctAnswer && 
                  styles.correctOption
              ]}
              onPress={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>解説:</Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
        
        {selectedOption !== null && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < questions.length - 1 ? '次の問題' : '結果を見る'}
            </Text>
          </TouchableOpacity>
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
  questionContainer: {
    padding: 20,
  },
  questionCount: {
    fontSize: 16,
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
    borderRadius: 5,
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
    borderRadius: 5,
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
  },
  nextButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
