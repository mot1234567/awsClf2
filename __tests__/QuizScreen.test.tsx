import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import QuizScreen from '../src/screens/QuizScreen';
import { AppProvider } from '../src/context/AppContext';

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

jest.mock('../src/context/AppContext', () => ({
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
}));

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

  it('renders loading state initially', () => {
    const { getByText } = render(
      <QuizScreen 
        navigation={mockNavigation as any} 
        route={mockRoute as any} 
      />
    );
    
    expect(getByText('問題を読み込み中...')).toBeTruthy();
  });

  it('navigates to Result screen after completing all questions', async () => {
    const { getByText, findByText } = render(
      <QuizScreen 
        navigation={mockNavigation as any} 
        route={mockRoute as any} 
      />
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
      <QuizScreen 
        navigation={mockNavigation as any} 
        route={{
          params: {
            mode: 'single',
          }
        } as any} 
      />
    );
    
    await findByText('What is AWS?');
    
    fireEvent.press(getByText('Amazon Web Services'));
    
    expect(getByText('解説:')).toBeTruthy();
  });

  it('handles empty questions array', () => {
    jest.mock('../src/data/sampleQuestions.json', () => []);
    
    const { getByText } = render(
      <QuizScreen 
        navigation={mockNavigation as any} 
        route={{
          params: {
            mode: 'bookmarked',
          }
        } as any} 
      />
    );
    
    expect(getByText('ブックマークした問題はありません。問題画面で星マークをタップすると、ブックマークに追加されます。')).toBeTruthy();
  });
});
