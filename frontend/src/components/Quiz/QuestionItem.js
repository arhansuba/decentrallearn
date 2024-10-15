import React from 'react';

const QuestionItem = ({ question, selectedAnswer, onAnswerSelect, quizSubmitted }) => {
  return (
    <div className="question-item">
      <h3>{question.text}</h3>
      {question.answers.map(answer => (
        <div key={answer.id}>
          <input
            type="radio"
            id={`answer-${answer.id}`}
            name={`question-${question.id}`}
            value={answer.id}
            checked={selectedAnswer === answer.id}
            onChange={() => onAnswerSelect(question.id, answer.id)}
            disabled={quizSubmitted}
          />
          <label htmlFor={`answer-${answer.id}`}>{answer.text}</label>
        </div>
      ))}
      {quizSubmitted && (
        <div className="feedback">
          {selectedAnswer === question.correctAnswerId ? (
            <span className="correct">Correct!</span>
          ) : (
            <span className="incorrect">Incorrect. The correct answer was: {
              question.answers.find(a => a.id === question.correctAnswerId).text
            }</span>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;