import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Question } from '../types';

type QuestionCardProps = {
  question: Question;
  selectedOption: number | null;
  showExplanation: boolean;
  isBookmarked: boolean;
  onSelectOption: (index: number) => void;
  onToggleBookmark: () => void;
};

export default function QuestionCard({
  question,
  selectedOption,
  showExplanation,
  isBookmarked,
  onSelectOption,
  onToggleBookmark,
}: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.domainTag}>{question.domain}</Text>
      <View style={styles.bookmarkContainer}>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={onToggleBookmark}
          testID="bookmark-button"
        >
          <Ionicons 
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
            size={24} 
            color={isBookmarked ? '#0066cc' : '#666'} 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.questionText}>{question.question}</Text>
      
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && 
                (index === question.correctAnswer 
                  ? styles.correctOption 
                  : styles.incorrectOption),
              selectedOption !== null && 
                index === question.correctAnswer && 
                styles.correctOption
            ]}
            onPress={() => onSelectOption(index)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>解説:</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  bookmarkContainer: {
    alignItems: 'flex-end',
    marginTop: -30,
    marginBottom: 10,
  },
  bookmarkButton: {
    padding: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
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
    padding: 12,
    borderRadius: 4,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
