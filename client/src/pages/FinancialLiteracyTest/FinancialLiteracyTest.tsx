import React, { useState } from 'react';
import TopBar from '../../components/core/TopBar';
import Header from '../../components/core/Header';
import Menu from '../../components/core/Menu';
import Social from '../../components/core/Social';
import Status from '../../components/shared/Status';
import Timer from '../../components/shared/Timer';
import Button from '../../components/shared/Button';
import Question from './Question';
import Answer from './Answer';
import './FinancialLiteracyTest.css';

const FinancialLiteracyTest: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const handleAnswerChange = (questionNumber: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  const sampleQuestion = "What was the primary innovation introduced by the Dutch East India Company in the 1600s that laid the groundwork for the modern stock market?";
  
  const sampleAnswers = [
    "Selling rights to profits to foreign people in exchange for local goods",
    "Paying sailors with shares instead of wages",
    "Selling ownership shares to private citizens to fund voyages",
    "Issuing government-backed bonds to finance expeditions"
  ];

  return (
    <div className="financial-literacy-test-page">
      <TopBar />
      <Header />
      <Menu />
      <Social />
      
      <div className="test-container">
        <div className="test-content">
          <button className="back-button">← Back</button>
          
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
            <Timer startTime={12} />
          </div>

          <div className="questions-section">
            <Question 
              questionNumber={1} 
              question={sampleQuestion}
            >
              {sampleAnswers.map((answer, index) => (
                <Answer
                  key={index}
                  value={`answer-${index}`}
                  label={answer}
                  checked={selectedAnswers[1] === `answer-${index}`}
                  onChange={(value) => handleAnswerChange(1, value)}
                  name="question-1"
                />
              ))}
            </Question>

            <Question 
              questionNumber={2} 
              question={sampleQuestion}
            >
              {sampleAnswers.map((answer, index) => (
                <Answer
                  key={index}
                  value={`answer-${index}`}
                  label={answer}
                  checked={selectedAnswers[2] === `answer-${index}`}
                  onChange={(value) => handleAnswerChange(2, value)}
                  name="question-2"
                />
              ))}
            </Question>
          </div>

          <div className="test-footer">
            <Button variant="primary" type="button">
              Finish Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialLiteracyTest;

