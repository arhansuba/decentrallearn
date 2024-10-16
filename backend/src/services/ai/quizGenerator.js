const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateQuiz(courseContent, difficulty, numberOfQuestions = 5) {
  try {
    const prompt = `Based on the following course content, generate a ${difficulty} level quiz with ${numberOfQuestions} multiple-choice questions. For each question, provide 4 options with only one correct answer. Also provide a brief explanation for the correct answer.

Course Content:
${courseContent}

Format each question as follows:
Q: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Brief explanation]

Generate the quiz now:`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const quizText = response.data.choices[0].text.trim();
    return parseQuizText(quizText);
  } catch (error) {
    console.error('Error generating AI quiz:', error);
    throw new Error('Failed to generate quiz');
  }
}

function parseQuizText(quizText) {
  const questions = quizText.split('\n\n');
  return questions.map(questionBlock => {
    const lines = questionBlock.split('\n');
    const questionText = lines[0].replace('Q: ', '').trim();
    const options = lines.slice(1, 5).map(option => option.slice(3).trim());
    const correctAnswer = lines[5].replace('Correct Answer: ', '').trim();
    const explanation = lines[6].replace('Explanation: ', '').trim();

    return {
      text: questionText,
      options: [
        { text: options[0], isCorrect: correctAnswer === 'A' },
        { text: options[1], isCorrect: correctAnswer === 'B' },
        { text: options[2], isCorrect: correctAnswer === 'C' },
        { text: options[3], isCorrect: correctAnswer === 'D' },
      ],
      explanation: explanation
    };
  });
}

async function generateAdaptiveQuiz(userPerformance, courseContent, difficulty) {
  // This is a placeholder for adaptive quiz generation
  // In a real implementation, you would analyze the user's performance and adjust difficulty accordingly
  console.log('Generating adaptive quiz - This feature is not yet fully implemented');
  return generateQuiz(courseContent, difficulty);
}

module.exports = {
  generateQuiz,
  generateAdaptiveQuiz
};