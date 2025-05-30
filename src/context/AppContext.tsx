import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AppState, 
  QuestionHistory, 
  UserProgress, 
  AppSettings, 
  STORAGE_KEYS,
  MockExamResult,
  DomainMap
} from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  showExplanationImmediately: true,
  shuffleOptions: true
};

const DEFAULT_USER_PROGRESS: UserProgress = {
  lastStudyDate: null,
  studyStreak: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  domainProgress: {
    'Cloud Concepts': { answered: 0, correct: 0, total: 0 },
    'Technology': { answered: 0, correct: 0, total: 0 },
    'Security and Compliance': { answered: 0, correct: 0, total: 0 },
    'Billing and Pricing': { answered: 0, correct: 0, total: 0 }
  },
  mockExamHistory: []
};

const initialState: AppState = {
  questionHistory: {},
  userProgress: DEFAULT_USER_PROGRESS,
  settings: DEFAULT_SETTINGS,
  isLoading: true
};

interface AppContextType extends AppState {
  bookmarkQuestion: (questionId: number, bookmarked: boolean) => Promise<void>;
  updateQuestionHistory: (questionId: number, isCorrect: boolean, domain?: string) => Promise<void>;
  saveMockExamResult: (result: MockExamResult) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetProgress: () => Promise<void>;
  resetSettings: () => Promise<void>;
  initializeDomainCounts: (domainCounts: Record<string, number>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);
        const questionHistory = historyJson ? JSON.parse(historyJson) : {};

        const progressJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
        const userProgress = progressJson ? JSON.parse(progressJson) : DEFAULT_USER_PROGRESS;

        const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        const settings = settingsJson ? JSON.parse(settingsJson) : DEFAULT_SETTINGS;

        setState({
          questionHistory,
          userProgress,
          settings,
          isLoading: false
        });
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const updateStudyStreak = async () => {
      if (state.isLoading) return;

      const today = new Date().toISOString().split('T')[0];
      const lastStudyDate = state.userProgress.lastStudyDate;

      let newStreak = state.userProgress.studyStreak;
      let newLastStudyDate = lastStudyDate;

      if (!lastStudyDate) {
        newStreak = 1;
        newLastStudyDate = today;
      } else {
        const lastDate = new Date(lastStudyDate);
        const todayDate = new Date(today);
        
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
          newLastStudyDate = today;
        } else if (diffDays > 1) {
          newStreak = 1;
          newLastStudyDate = today;
        }
      }

      if (newStreak !== state.userProgress.studyStreak || newLastStudyDate !== lastStudyDate) {
        const updatedProgress = {
          ...state.userProgress,
          studyStreak: newStreak,
          lastStudyDate: newLastStudyDate
        };

        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updatedProgress));
        
        setState(prev => ({
          ...prev,
          userProgress: updatedProgress
        }));
      }
    };

    updateStudyStreak();
  }, [state.userProgress.totalQuestionsAnswered, state.isLoading]);

  const bookmarkQuestion = async (questionId: number, bookmarked: boolean) => {
    try {
      const updatedHistory = { ...state.questionHistory };
      
      if (updatedHistory[questionId]) {
        updatedHistory[questionId] = {
          ...updatedHistory[questionId],
          bookmarked
        };
      } else {
        updatedHistory[questionId] = {
          questionId,
          attempts: 0,
          correctAttempts: 0,
          lastAttemptDate: new Date().toISOString(),
          bookmarked
        };
      }

      await AsyncStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(updatedHistory));
      
      setState(prev => ({
        ...prev,
        questionHistory: updatedHistory
      }));
    } catch (error) {
      console.error('Error bookmarking question:', error);
    }
  };

  const updateQuestionHistory = async (questionId: number, isCorrect: boolean, domain?: string) => {
    try {
      const updatedHistory = { ...state.questionHistory };
      const currentDate = new Date().toISOString();
      
      if (updatedHistory[questionId]) {
        updatedHistory[questionId] = {
          ...updatedHistory[questionId],
          attempts: updatedHistory[questionId].attempts + 1,
          correctAttempts: updatedHistory[questionId].correctAttempts + (isCorrect ? 1 : 0),
          lastAttemptDate: currentDate
        };
      } else {
        updatedHistory[questionId] = {
          questionId,
          attempts: 1,
          correctAttempts: isCorrect ? 1 : 0,
          lastAttemptDate: currentDate,
          bookmarked: false
        };
      }

      const updatedProgress = { ...state.userProgress };
      updatedProgress.totalQuestionsAnswered += 1;

      if (isCorrect) {
        updatedProgress.totalCorrectAnswers += 1;
      }

      if (domain && updatedProgress.domainProgress[domain]) {
        updatedProgress.domainProgress[domain].answered += 1;
        if (isCorrect) {
          updatedProgress.domainProgress[domain].correct += 1;
        }
      }

      await AsyncStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(updatedHistory));
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updatedProgress));
      
      setState(prev => ({
        ...prev,
        questionHistory: updatedHistory,
        userProgress: updatedProgress
      }));
    } catch (error) {
      console.error('Error updating question history:', error);
    }
  };

  const saveMockExamResult = async (result: MockExamResult) => {
    try {
      const updatedProgress = { ...state.userProgress };
      updatedProgress.mockExamHistory = [...updatedProgress.mockExamHistory, result];

      Object.entries(result.domainScores).forEach(([domain, scores]) => {
        if (updatedProgress.domainProgress[domain]) {
          updatedProgress.domainProgress[domain].answered += scores.total;
          updatedProgress.domainProgress[domain].correct += scores.correct;
        }
      });

      updatedProgress.totalQuestionsAnswered += result.totalQuestions;
      updatedProgress.totalCorrectAnswers += result.score;

      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updatedProgress));
      
      setState(prev => ({
        ...prev,
        userProgress: updatedProgress
      }));
    } catch (error) {
      console.error('Error saving mock exam result:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...state.settings, ...newSettings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
      
      setState(prev => ({
        ...prev,
        settings: updatedSettings
      }));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.QUESTION_HISTORY);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
      
      setState(prev => ({
        ...prev,
        questionHistory: {},
        userProgress: DEFAULT_USER_PROGRESS
      }));
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
      
      setState(prev => ({
        ...prev,
        settings: DEFAULT_SETTINGS
      }));
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  const initializeDomainCounts = async (domainCounts: Record<string, number>) => {
    try {
      if (state.isLoading) return;

      const updatedProgress = { ...state.userProgress };
      
      Object.entries(domainCounts).forEach(([domain, count]) => {
        if (updatedProgress.domainProgress[domain]) {
          updatedProgress.domainProgress[domain].total = count;
        }
      });

      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updatedProgress));
      
      setState(prev => ({
        ...prev,
        userProgress: updatedProgress
      }));
    } catch (error) {
      console.error('Error initializing domain counts:', error);
    }
  };

  const contextValue: AppContextType = {
    ...state,
    bookmarkQuestion,
    updateQuestionHistory,
    saveMockExamResult,
    updateSettings,
    resetProgress,
    resetSettings,
    initializeDomainCounts
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
