import React, { useState, useEffect } from 'react';
import { fetchUserProgress } from '../../services/api';

const ProgressTracker = ({ userId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      const fetchedProgress = await fetchUserProgress(userId);
      setProgress(fetchedProgress);
    };
    loadProgress();
  }, [userId]);

  if (!progress) {
    return <div>Loading progress...</div>;
  }

  return (
    <div className="progress-tracker">
      <h3>Learning Progress</h3>
      {progress.courses.map(course => (
        <div key={course.id} className="course-progress">
          <h4>{course.title}</h4>
          <progress value={course.completionPercentage} max="100" />
          <span>{course.completionPercentage}% complete</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;