import { QuizQuestion, QuizQuestionResponse, QuizCheckResponse } from '../types/quiz';
import * as fs from 'fs';
import * as path from 'path';

let quizDataCache: QuizQuestion[] | null = null;

function getQuizData(): QuizQuestion[] {
  if (!quizDataCache) {
    const jsonPath = path.join(__dirname, '../../vibe.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    quizDataCache = JSON.parse(jsonData) as QuizQuestion[];
  }
  return quizDataCache;
}

export function getQuizQuestions(): QuizQuestionResponse[] {
  const questions = getQuizData();
  return questions.map(({ id, questionText, options }) => ({
    id,
    questionText,
    options,
  }));
}

export function getQuizQuestionById(id: number): QuizQuestion | undefined {
  const questions = getQuizData();
  return questions.find((q) => q.id === id);
}

export function calculateScore(
  answers: { [questionId: number]: number },
  timeElapsed: number
): QuizCheckResponse {
  const questions = getQuizData();
  const totalQuestions = questions.length;
  let correctAnswers = 0;
  const results = [];

  // Check each answer
  for (const question of questions) {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) {
      correctAnswers++;
    }

    results.push({
      questionId: question.id,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswer !== undefined ? userAnswer : -1,
      isCorrect,
    });
  }

  // Calculate accuracy score (5 points per correct answer)
  const accuracyScore = correctAnswers * 5;

  // Calculate time bonus
  // If time >= 300 seconds (5 minutes), no bonus
  // If time < 300 seconds, bonus = (300 - time) points
  let timeBonus = 0;
  if (timeElapsed < 300) {
    timeBonus = 300 - timeElapsed;
  }

  // Total score = accuracy score + time bonus
  const score = accuracyScore + timeBonus;

  return {
    score,
    accuracyScore,
    timeBonus,
    totalQuestions,
    correctAnswers,
    results,
  };
}

