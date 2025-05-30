
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: string;
  difficulty: string;
}

export const DomainMap: Record<string, string> = {
  'cloud-concepts': 'Cloud Concepts',
  technology: 'Technology',
  security: 'Security and Compliance',
  'billing-pricing': 'Billing and Pricing'
};

export interface QuestionHistory {
  questionId: number;
  attempts: number;
  correctAttempts: number;
  lastAttemptDate: string; // ISO date string
  bookmarked: boolean;
}

export interface MockExamResult {
  id: string; // Unique ID for the exam attempt
  date: string; // ISO date string
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  domainScores: {
    [domain: string]: {
      correct: number;
      total: number;
    };
  };
}

export interface AppSettings {
  showExplanationImmediately: boolean;
  shuffleOptions: boolean;
}

export interface UserProgress {
  lastStudyDate: string | null; // ISO date string
  studyStreak: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  domainProgress: {
    [domain: string]: {
      answered: number;
      correct: number;
      total: number;
    };
  };
  mockExamHistory: MockExamResult[];
}

export interface AppState {
  questionHistory: Record<number, QuestionHistory>;
  userProgress: UserProgress;
  settings: AppSettings;
  isLoading: boolean;
}

export const STORAGE_KEYS = {
  QUESTION_HISTORY: 'aws_clf_question_history',
  USER_PROGRESS: 'aws_clf_user_progress',
  SETTINGS: 'aws_clf_settings',
  MOCK_EXAM_HISTORY: 'aws_clf_mock_exam_history'
};

export type QuizMode = 'single' | 'domain' | 'full' | 'bookmarked' | 'incorrect' | 'mock';

export type RootStackParamList = {
  Home: undefined;
  Quiz: { 
    mode: QuizMode; 
    domainFilter?: string;
    questionId?: number;
  };
  Result: { 
    score: number; 
    total: number;
    mockExamId?: string;
  };
  MockExam: undefined;
  MockExamResult: { 
    mockExamId: string;
  };
  Statistics: undefined;
  Bookmarks: undefined;
  Settings: undefined;
  Contact: undefined;
};

export type RootTabParamList = {
  HomeTab: undefined;
  StatisticsTab: undefined;
  BookmarksTab: undefined;
  SettingsTab: undefined;
};
