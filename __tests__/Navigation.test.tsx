import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import Navigation from '../src/navigation';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../src/context/AppContext', () => {
  const React = require('react');
  return {
    useAppContext: () => ({
      questionHistory: {},
      settings: {
        showExplanationImmediately: true,
        shuffleOptions: false,
      },
      bookmarkQuestion: jest.fn(),
      updateQuestionHistory: jest.fn(),
    }),
    AppProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('../src/screens/HomeScreen', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return function MockHomeScreen({ navigation }: any) {
    return (
      <View testID="home-screen">
        <TouchableOpacity
          testID="navigate-to-quiz"
          onPress={() => navigation.navigate('Quiz', { mode: 'single' })}
        >
          <Text>Go to Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('../src/screens/QuizScreen', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return function MockQuizScreen({ navigation }: any) {
    return (
      <View testID="quiz-screen">
        <TouchableOpacity
          testID="navigate-to-result"
          onPress={() => navigation.navigate('Result', { score: 5, total: 10 })}
        >
          <Text>Go to Result</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('../src/screens/ResultScreen', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return function MockResultScreen({ navigation }: any) {
    return (
      <View testID="result-screen">
        <TouchableOpacity
          testID="navigate-to-home"
          onPress={() => navigation.navigate('Home')}
        >
          <Text>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

describe('Navigation', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Navigation />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('handles navigation between screens', () => {
    const { getByTestId } = render(<Navigation />);
    
    fireEvent.press(getByTestId('navigate-to-quiz'));
    expect(getByTestId('quiz-screen')).toBeTruthy();
    
    fireEvent.press(getByTestId('navigate-to-result'));
    expect(getByTestId('result-screen')).toBeTruthy();
    
    fireEvent.press(getByTestId('navigate-to-home'));
    expect(getByTestId('home-screen')).toBeTruthy();
  });
});
