import React, { useState, useEffect } from 'react';
import Header from '../../components/core/Header';
import Status from '../../components/shared/Status';
import Timer from '../../components/shared/Timer';
import Button from '../../components/shared/Button';
import Question from './Question';
import Answer from './Answer';
import { QuizQuestion, QuizCheckRequest, QuizCheckResponse } from '../../types/quiz';
import './FinancialLiteracyTest.css';

const FinancialLiteracyTest: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<QuizCheckResponse | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/quiz');
      const data: QuizQuestion[] = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleFinishTest = async () => {
    setSubmitting(true);
    try {
      const request: QuizCheckRequest = {
        answers: selectedAnswers,
        timeElapsed,
      };
      
      const response = await fetch('/api/quiz/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      const data: QuizCheckResponse = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUpdate = (seconds: number) => {
    setTimeElapsed(seconds);
  };

  return (
    <div className="financial-literacy-test-page">
      <Header />
      
      <div className="test-container">
        <div className="test-content">
          <h1 className="test-title">Financial Literacy Test</h1>
          
          <div className="scoring-info">
            <p>
              This scoring system rewards both accuracy and exceptional speed with a tiered bonus structure. 
              The test contains 30 questions, <strong>each worth 5 points</strong>, giving a total possible accuracy score of 150 points. 
              Students who take five minutes or longer (300 seconds) receive only their accuracy score, with no time bonus added. 
              Students who finish under five minutes earn a <strong>speed bonus</strong> of 1 point for every second under 5 minutes (300 seconds). 
              For example, completing the test in 4:30 earns 30 bonus points, and finishing in 3:15 earns 105 bonus points.
            </p>
            
            <div className="scoring-tiers">
              <div className="tier">
                <strong>Pass:</strong> 115+ points
              </div>
              <div className="tier">
                <strong>Proficient:</strong> 130+ points
              </div>
              <div className="tier">
                <strong>Advanced:</strong> 150+ points
              </div>
              <div className="tier">
                <strong>Expert:</strong> 170+ points
              </div>
            </div>
          </div>

          <div className="test-status-section">
            <Status status="In Progress" />
            <Timer startTime={0} onTimeUpdate={handleTimeUpdate} />
          </div>

          {loading ? (
            <div className="loading">Loading questions...</div>
          ) : results ? (
            <div className="results-section">
              <h2>Test Results</h2>
              <div className="results-summary">
                <div className="result-item">
                  <strong>Total Score:</strong> {results.score} points
                </div>
                <div className="result-item">
                  <strong>Accuracy Score:</strong> {results.accuracyScore} points ({results.correctAnswers}/{results.totalQuestions} correct)
                </div>
                <div className="result-item">
                  <strong>Time Bonus:</strong> {results.timeBonus} points
                </div>
                <div className="result-item">
                  <strong>Time Taken:</strong> {Math.floor(timeElapsed / 60)} mins {timeElapsed % 60} seconds
                </div>
              </div>
              <div className="results-details">
                <h3>Question Results:</h3>
                {results.results.map((result, index) => (
                  <div key={result.questionId} className={`result-question ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                    <strong>Question {index + 1}:</strong> {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    {!result.isCorrect && (
                      <div className="correct-answer-info">
                        Correct answer was option {result.correctAnswer + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="questions-section">
                {questions.map((question) => (
                  <Question 
                    key={question.id}
                    questionNumber={question.id} 
                    question={question.questionText}
                  >
                    {question.options.map((option, index) => (
                      <Answer
                        key={index}
                        value={index.toString()}
                        label={option}
                        checked={selectedAnswers[question.id] === index}
                        onChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                        name={`question-${question.id}`}
                      />
                    ))}
                  </Question>
                ))}
              </div>

              <div className="test-footer">
                <Button 
                  variant="primary" 
                  type="button"
                  onClick={handleFinishTest}
                  disabled={submitting || Object.keys(selectedAnswers).length === 0}
                >
                  {submitting ? 'Submitting...' : 'Finish Test'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialLiteracyTest;

