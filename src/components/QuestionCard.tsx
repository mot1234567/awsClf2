import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type QuestionCardProps = {
  question: string;
  options: string[];
  selectedOption: number | null;
  correctAnswer: number;
  showExplanation: boolean;
  explanation: string;
  onSelectOption: (index: number) => void;
};

export default function QuestionCard({
  question,
  options,
  selectedOption,
  correctAnswer,
  showExplanation,
  explanation,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && 
                (index === correctAnswer 
                  ? styles.correctOption 
                  : styles.incorrectOption),
              selectedOption !== null && 
                index === correctAnswer && 
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
          <Text style={styles.explanationText}>{explanation}</Text>
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
