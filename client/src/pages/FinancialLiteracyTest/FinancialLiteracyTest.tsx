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
  const [testStarted, setTestStarted] = useState(false);

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

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const getLevel = (score: number): string => {
    if (score >= 170) return 'Expert';
    if (score >= 150) return 'Advanced';
    if (score >= 130) return 'Proficient';
    if (score >= 115) return 'Passing';
    return 'Below Passing';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s (${seconds} seconds)`;
  };

  const getQuestionById = (questionId: number): QuizQuestion | undefined => {
    return questions.find(q => q.id === questionId);
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

          {loading ? (
            <div className="loading">Loading questions...</div>
          ) : !testStarted ? (
            <div className="test-ready-section">
              <Button 
                variant="primary" 
                type="button"
                onClick={handleStartTest}
              >
                I'm ready!
              </Button>
            </div>
          ) : results ? (
            <>
              <div className="results-questions-section">
                {results.results.map((result, index) => {
                  const question = getQuestionById(result.questionId);
                  if (!question) return null;
                  
                  return (
                    <div key={result.questionId} className={`result-question-card ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      <div className={`result-question-header ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        Question {index + 1} {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                      <div className="result-question-text">{question.questionText}</div>
                      <div className="result-options">
                        {question.options.map((option, optionIndex) => {
                          const isCorrect = optionIndex === result.correctAnswer;
                          const isUserAnswer = optionIndex === result.userAnswer;
                          const showGreen = isCorrect;
                          const showRed = !result.isCorrect && isUserAnswer && !isCorrect;
                          
                          return (
                            <div key={optionIndex} className={`result-option ${showGreen ? 'correct-option' : ''} ${showRed ? 'incorrect-option' : ''}`}>
                              <span className="option-indicator">
                                {showGreen && <span className="indicator-dot green-dot"></span>}
                                {showRed && <span className="indicator-dot red-dot"></span>}
                              </span>
                              <span className="option-text">{option}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="results-summary-section">
                <h2 className="results-title">Results</h2>
                <div className="results-summary">
                  <div className="result-summary-item">
                    <span className="result-label">Correct:</span>
                    <span className="result-value">{results.correctAnswers}/{results.totalQuestions}</span>
                  </div>
                  <div className="result-summary-item">
                    <span className="result-label">Time:</span>
                    <span className="result-value">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="result-summary-item">
                    <span className="result-label">Score:</span>
                    <span className="result-value">{results.score}</span>
                  </div>
                  <div className="result-summary-item">
                    <span className="result-label">Level:</span>
                    <span className="result-value">{getLevel(results.score)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="test-status-section">
                <Status status="In Progress" />
                <div className="timer-sticky-wrapper">
                  <Timer startTime={0} onTimeUpdate={handleTimeUpdate} />
                </div>
              </div>

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

