import React, { useState, useEffect, useContext } from 'react';
import { fetchForumThreads, createForumThread, createForumReply } from '../../services/api';
import { UserContext } from '../contexts/UserContext';

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadThreads = async () => {
      const fetchedThreads = await fetchForumThreads();
      setThreads(fetchedThreads);
    };
    loadThreads();
  }, []);

  const handleCreateThread = async () => {
    if (newThreadTitle && newThreadContent) {
      const newThread = await createForumThread(user.id, newThreadTitle, newThreadContent);
      setThreads([newThread, ...threads]);
      setNewThreadTitle('');
      setNewThreadContent('');
    }
  };

  const handleCreateReply = async (threadId, replyContent) => {
    const newReply = await createForumReply(user.id, threadId, replyContent);
    setThreads(threads.map(thread => 
      thread.id === threadId 
        ? { ...thread, replies: [...thread.replies, newReply] }
        : thread
    ));
  };

  return (
    <div className="forum">
      <h2>Community Forum</h2>
      <div className="new-thread">
        <input 
          type="text" 
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
          placeholder="Thread Title"
        />
        <textarea 
          value={newThreadContent}
          onChange={(e) => setNewThreadContent(e.target.value)}
          placeholder="Thread Content"
        />
        <button onClick={handleCreateThread}>Create Thread</button>
      </div>
      {threads.map(thread => (
        <div key={thread.id} className="thread">
          <h3>{thread.title}</h3>
          <p>{thread.content}</p>
          <p>By: {thread.author} on {new Date(thread.createdAt).toLocaleString()}</p>
          <div className="replies">
            {thread.replies.map(reply => (
              <div key={reply.id} className="reply">
                <p>{reply.content}</p>
                <p>By: {reply.author} on {new Date(reply.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <textarea 
            placeholder="Write a reply..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCreateReply(thread.id, e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Forum;
