import React from 'react';
import './Question.css';

interface QuestionProps {
  questionNumber: number;
  question: string;
  children: React.ReactNode;
}

const Question: React.FC<QuestionProps> = ({ questionNumber, question, children }) => {
  return (
    <div className="question-container">
      <h3 className="question-title">Question {questionNumber}</h3>
      <p className="question-text">{question}</p>
      <div className="question-answers">
        {children}
      </div>
    </div>
  );
};

export default Question;

