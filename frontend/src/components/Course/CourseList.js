import React, { useState, useEffect } from 'react';
import CourseItem from './CourseItem';
import { fetchCourses } from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    };
    loadCourses();
  }, []);

  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      {courses.map(course => (
        <CourseItem key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;