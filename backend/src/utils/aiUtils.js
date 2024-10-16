const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Preprocess text for AI models
function preprocessText(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}

// Tokenize text
function tokenizeText(text) {
  return tokenizer.tokenize(text);
}

// Create a TensorFlow.js embedding for text
async function createEmbedding(text, modelUrl) {
  const model = await tf.loadLayersModel(modelUrl);
  const processedText = preprocessText(text);
  const tokens = tokenizeText(processedText);
  const inputTensor = tf.tensor2d([tokens]);
  const embedding = model.predict(inputTensor);
  return embedding.arraySync()[0];
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Analyze sentiment of text
function analyzeSentiment(text) {
  const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const processedText = preprocessText(text);
  const tokens = tokenizeText(processedText);
  return analyzer.getSentiment(tokens);
}

// Generate a summary of text
function generateSummary(text, sentenceCount = 3) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
  if (!sentences || sentences.length <= sentenceCount) {
    return text;
  }
  
  const rankedSentences = sentences.map((sentence, index) => ({
    sentence,
    score: sentence.split(' ').length + (index === 0 ? 3 : 0)  // Slightly favor the first sentence
  }));
  
  rankedSentences.sort((a, b) => b.score - a.score);
  
  const summary = rankedSentences.slice(0, sentenceCount)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map(item => item.sentence)
    .join(' ');
  
  return summary;
}

module.exports = {
  preprocessText,
  tokenizeText,
  createEmbedding,
  cosineSimilarity,
  analyzeSentiment,
  generateSummary
};
