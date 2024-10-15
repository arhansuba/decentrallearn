import React, { useState, useEffect } from 'react';
import QuestionItem from './QuestionItem';
import { fetchQuiz, submitQuizResults } from '../../services/api';

const QuizComponent = ({ courseId }) => {
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      const fetchedQuiz = await fetchQuiz(courseId);
      setQuiz(fetchedQuiz);
    };
    loadQuiz();
  }, [courseId]);

  const handleAnswerSelect = (questionId, answerId) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleQuizSubmit = async () => {
    const results = await submitQuizResults(courseId, userAnswers);
    setQuizSubmitted(true);
    // Handle results, update user progress, etc.
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="quiz-component">
      <h2>{quiz.title}</h2>
      {quiz.questions.map(question => (
        <QuestionItem
          key={question.id}
          question={question}
          selectedAnswer={userAnswers[question.id]}
          onAnswerSelect={handleAnswerSelect}
          quizSubmitted={quizSubmitted}
        />
      ))}
      {!quizSubmitted && (
        <button onClick={handleQuizSubmit}>Submit Quiz</button>
      )}
    </div>
  );
};

export default QuizComponent;