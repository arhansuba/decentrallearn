import React from 'react';
import { Link } from 'react-router-dom';

const CourseItem = ({ course }) => {
  return (
    <div className="course-item">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>Difficulty: {course.difficulty}</p>
      <p>Duration: {course.duration} hours</p>
      <Link to={`/course/${course.id}`}>Start Learning</Link>
    </div>
  );
};

export default CourseItem;
