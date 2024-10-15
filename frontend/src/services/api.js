import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const fetchCourseContent = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/content`);
  return response.data;
};

export const fetchQuiz = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/quiz`);
  return response.data;
};

export const submitQuizResults = async (courseId, answers) => {
  const response = await api.post(`/courses/${courseId}/quiz`, { answers });
  return response.data;
};

export const fetchUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

export const fetchUserProgress = async (userId) => {
  const response = await api.get(`/users/${userId}/progress`);
  return response.data;
};

export const fetchForumThreads = async () => {
  const response = await api.get('/forum/threads');
  return response.data;
};

export const createForumThread = async (userId, title, content) => {
  const response = await api.post('/forum/threads', { userId, title, content });
  return response.data;
};

export const createForumReply = async (userId, threadId, content) => {
  const response = await api.post(`/forum/threads/${threadId}/replies`, { userId, content });
  return response.data;
};

export const fetchSuggestions = async () => {
  const response = await api.get('/suggestions');
  return response.data;
};

export const createSuggestion = async (userId, content) => {
  const response = await api.post('/suggestions', { userId, content });
  return response.data;
};

export const voteSuggestion = async (userId, suggestionId, voteType) => {
  const response = await api.post(`/suggestions/${suggestionId}/vote`, { userId, voteType });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/users/current');
  return response.data;
};