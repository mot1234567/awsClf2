import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import QuizScreen from '../src/screens/QuizScreen';
import { AppProvider } from '../src/context/AppContext';
import { NavigationContainer } from '@react-navigation/native';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
};

const mockRoute = {
  params: {
    mode: 'single',
  },
};

jest.mock('../src/context/AppContext', () => {
  const React = require('react');
  const AppContext = React.createContext(null);

  const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [questionHistory, setQuestionHistory] = React.useState({});
    const bookmarkQuestion = jest.fn();
    const updateQuestionHistory = jest.fn((id: number, isCorrect: boolean, domain?: string) => {
      setQuestionHistory((prev: Record<number, any>) => ({
        ...prev,
        [id]: {
          questionId: id,
          attempts: (prev[id]?.attempts || 0) + 1,
          correctAttempts: (prev[id]?.correctAttempts || 0) + (isCorrect ? 1 : 0),
          lastAttemptDate: new Date().toISOString(),
          bookmarked: prev[id]?.bookmarked || false,
        },
      }));
    });

    const value = {
      questionHistory,
      settings: {
        showExplanationImmediately: true,
        shuffleOptions: false,
      },
      bookmarkQuestion,
      updateQuestionHistory,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
  };

  const useAppContext = () => React.useContext(AppContext);

  return { AppProvider, useAppContext };
});

jest.mock('../src/data/sampleQuestions.json', () => [
  {
    id: 1,
    question: 'What is AWS?',
    options: [
      'Amazon Web Services',
      'Amazon Website Service',
      'Amazon Warehouse System',
      'Amazon Web System'
    ],
    correctAnswer: 0,
    explanation: 'AWS stands for Amazon Web Services, which is a cloud computing platform.',
    domain: 'Cloud Concepts',
    difficulty: 'easy'
  }
]);

describe('QuizScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <AppProvider>
          <QuizScreen
            navigation={mockNavigation as any}
            route={mockRoute as any}
          />
        </AppProvider>
      </NavigationContainer>
    );

    await findByText('What is AWS?');
  });

  it('navigates to Result screen after completing all questions', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <AppProvider>
          <QuizScreen
            navigation={mockNavigation as any}
            route={mockRoute as any}
          />
        </AppProvider>
      </NavigationContainer>
    );
    
    await findByText('What is AWS?');
    
    fireEvent.press(getByText('Amazon Web Services'));
    
    fireEvent.press(getByText('結果を見る'));
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Result', {
      score: 1,
      total: 1
    });
  });

  it('shows explanation when an option is selected', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <AppProvider>
          <QuizScreen
            navigation={mockNavigation as any}
            route={{
              params: {
                mode: 'single',
              }
            } as any}
          />
        </AppProvider>
      </NavigationContainer>
    );
    
    await findByText('What is AWS?');
    
    fireEvent.press(getByText('Amazon Web Services'));
    
    expect(getByText('解説:')).toBeTruthy();
  });

  it('does not reset current question after selecting an option', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <AppProvider>
          <QuizScreen
            navigation={mockNavigation as any}
            route={mockRoute as any}
          />
        </AppProvider>
      </NavigationContainer>
    );

    await findByText('What is AWS?');

    fireEvent.press(getByText('Amazon Web Services'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('解説:')).toBeTruthy();
  });

  it('handles empty questions array', () => {
    jest.mock('../src/data/sampleQuestions.json', () => []);
    
    const { getByText } = render(
      <NavigationContainer>
        <AppProvider>
          <QuizScreen
            navigation={mockNavigation as any}
            route={{
              params: {
                mode: 'bookmarked',
              }
            } as any}
          />
        </AppProvider>
      </NavigationContainer>
    );
    
    expect(getByText('ブックマークした問題はありません。問題画面で星マークをタップすると、ブックマークに追加されます。')).toBeTruthy();
  });
});
