import * as tf from '@tensorflow/tfjs';

export const preprocessText = (text) => {
  // Convert to lowercase and remove punctuation
  return text.toLowerCase().replace(/[^\w\s]/g, '');
};

export const tokenizeText = (text) => {
  // Simple tokenization by splitting on whitespace
  return text.split(/\s+/);
};

export const createEmbedding = async (text, modelUrl) => {
  const model = await tf.loadLayersModel(modelUrl);
  const tokenized = tokenizeText(preprocessText(text));
  const inputTensor = tf.tensor2d([tokenized]);
  const embedding = model.predict(inputTensor);
  return embedding.arraySync()[0];
};

export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
