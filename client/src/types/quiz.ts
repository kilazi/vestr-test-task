export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
}

export interface QuizCheckRequest {
  answers: { [questionId: number]: number }; // questionId -> selectedOptionIndex
  timeElapsed: number; // seconds
}

export interface QuizCheckResponse {
  score: number;
  accuracyScore: number;
  timeBonus: number;
  totalQuestions: number;
  correctAnswers: number;
  results: {
    questionId: number;
    correctAnswer: number;
    userAnswer: number;
    isCorrect: boolean;
  }[];
}

