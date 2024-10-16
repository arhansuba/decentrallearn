const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateAIContent(topic, difficulty, length = 'medium') {
  try {
    const prompt = `Generate an educational content about ${topic} for a ${difficulty} level course. The content should be ${length} in length and include key concepts, examples, and explanations.`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: getMaxTokens(length),
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw new Error('Failed to generate content');
  }
}

function getMaxTokens(length) {
  switch (length) {
    case 'short': return 200;
    case 'medium': return 500;
    case 'long': return 1000;
    default: return 500;
  }
}

async function enhanceContentWithImages(content) {
  // This is a placeholder for image generation functionality
  // In a real implementation, you might use a service like DALL-E or Midjourney
  console.log('Enhancing content with images - This feature is not yet implemented');
  return content;
}

async function generateStructuredContent(topic, difficulty, sections = ['introduction', 'main content', 'conclusion']) {
  let structuredContent = {};

  for (const section of sections) {
    structuredContent[section] = await generateAIContent(`${topic} - ${section}`, difficulty, 'short');
  }

  return structuredContent;
}

module.exports = {
  generateAIContent,
  enhanceContentWithImages,
  generateStructuredContent
};
