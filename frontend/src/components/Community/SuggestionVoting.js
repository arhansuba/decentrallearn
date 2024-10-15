import React, { useState, useEffect, useContext } from 'react';
import { fetchSuggestions, createSuggestion, voteSuggestion } from '../../services/api';
import { UserContext } from '../contexts/UserContext';
import { Web3Context } from '../contexts/Web3Context';

const SuggestionVoting = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState('');
  const { user } = useContext(UserContext);
  const { web3 } = useContext(Web3Context);

  useEffect(() => {
    const loadSuggestions = async () => {
      const fetchedSuggestions = await fetchSuggestions();
      setSuggestions(fetchedSuggestions);
    };
    loadSuggestions();
  }, []);

  const handleCreateSuggestion = async () => {
    if (newSuggestion) {
      const createdSuggestion = await createSuggestion(user.id, newSuggestion);
      setSuggestions([createdSuggestion, ...suggestions]);
      setNewSuggestion('');
    }
  };

  const handleVote = async (suggestionId, voteType) => {
    if (web3.isConnected) {
      await voteSuggestion(user.id, suggestionId, voteType);
      const updatedSuggestions = suggestions.map(suggestion =>
        suggestion.id === suggestionId
          ? { ...suggestion, votes: suggestion.votes + (voteType === 'up' ? 1 : -1) }
          : suggestion
      );
      setSuggestions(updatedSuggestions);
    } else {
      alert('Please connect your wallet to vote');
    }
  };

  return (
    <div className="suggestion-voting">
      <h2>Course Suggestions</h2>
      <div className="new-suggestion">
        <input 
          type="text" 
          value={newSuggestion}
          onChange={(e) => setNewSuggestion(e.target.value)}
          placeholder="Suggest a new course topic"
        />
        <button onClick={handleCreateSuggestion}>Submit Suggestion</button>
      </div>
      {suggestions.map(suggestion => (
        <div key={suggestion.id} className="suggestion">
          <p>{suggestion.content}</p>
          <p>By: {suggestion.author} on {new Date(suggestion.createdAt).toLocaleString()}</p>
          <p>Votes: {suggestion.votes}</p>
          <button onClick={() => handleVote(suggestion.id, 'up')}>👍</button>
          <button onClick={() => handleVote(suggestion.id, 'down')}>👎</button>
        </div>
      ))}
    </div>
  );
};

export default SuggestionVoting;