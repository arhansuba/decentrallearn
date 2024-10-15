import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCourseContent } from '../../services/api';

const CourseContent = () => {
  const [content, setContent] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const loadContent = async () => {
      const fetchedContent = await fetchCourseContent(courseId);
      setContent(fetchedContent);
    };
    loadContent();
  }, [courseId]);

  if (!content) {
    return <div>Loading course content...</div>;
  }

  return (
    <div className="course-content">
      <h2>{content.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
      {content.sections.map((section, index) => (
        <div key={index} className="course-section">
          <h3>{section.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      ))}
    </div>
  );
};

export default CourseContent;