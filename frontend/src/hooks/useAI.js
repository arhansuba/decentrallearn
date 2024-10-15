import { useState, useCallback } from 'react';
import axios from 'axios';

const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = useCallback(async (prompt, type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/generate', { prompt, type });
      setLoading(false);
      return response.data.content;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  const analyzeUserProgress = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/analyze-progress', { userId });
      setLoading(false);
      return response.data.analysis;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  return { generateContent, analyzeUserProgress, loading, error };
};

export default useAI;
