import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuestionCard from '../src/components/QuestionCard';
import { Question } from '../src/types';

describe('QuestionCard', () => {
  const mockQuestion: Question = {
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
  };

  const mockProps = {
    question: mockQuestion,
    selectedOption: null as number | null,
    showExplanation: false,
    isBookmarked: false,
    onSelectOption: jest.fn(),
    onToggleBookmark: jest.fn()
  };

  it('renders correctly', () => {
    const { getByText } = render(<QuestionCard {...mockProps} />);
    
    expect(getByText('What is AWS?')).toBeTruthy();
    expect(getByText('Amazon Web Services')).toBeTruthy();
    expect(getByText('Amazon Website Service')).toBeTruthy();
    expect(getByText('Cloud Concepts')).toBeTruthy();
  });

  it('calls onSelectOption when an option is pressed', () => {
    const { getAllByText } = render(<QuestionCard {...mockProps} />);
    
    fireEvent.press(getAllByText('Amazon Web Services')[0]);
    expect(mockProps.onSelectOption).toHaveBeenCalledWith(0);
  });

  it('calls onToggleBookmark when bookmark button is pressed', () => {
    const { UNSAFE_getAllByProps } = render(<QuestionCard {...mockProps} />);
    
    const bookmarkButton = UNSAFE_getAllByProps({ onPress: mockProps.onToggleBookmark })[0];
    fireEvent.press(bookmarkButton);
    expect(mockProps.onToggleBookmark).toHaveBeenCalled();
  });

  it('shows explanation when showExplanation is true', () => {
    const { getByText } = render(
      <QuestionCard 
        {...mockProps} 
        showExplanation={true}
      />
    );
    
    expect(getByText('解説:')).toBeTruthy();
    expect(getByText('AWS stands for Amazon Web Services, which is a cloud computing platform.')).toBeTruthy();
  });

  it('highlights correct answer when an option is selected', () => {
    const { getAllByText } = render(
      <QuestionCard 
        {...mockProps} 
        selectedOption={0}
      />
    );
    
    const option = getAllByText('Amazon Web Services')[0];
    expect(option.props.style).toBeDefined();
  });
});
