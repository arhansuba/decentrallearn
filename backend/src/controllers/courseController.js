const Course = require('../models/Course');
const User = require('../models/User');
const { generateAIContent } = require('../services/ai/contentGenerator');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, difficulty, estimatedDuration } = req.body;

    const newCourse = new Course({
      title,
      description,
      difficulty,
      estimatedDuration,
      creator: req.user.id  // Assuming middleware sets req.user
    });

    await newCourse.save();

    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('creator', 'username');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('creator', 'username');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description, difficulty, estimatedDuration, content } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $set: { title, description, difficulty, estimatedDuration, content } },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const user = await User.findById(req.user.id);

    if (!course || !user) {
      return res.status(404).json({ message: 'Course or user not found' });
    }

    if (user.coursesEnrolled.includes(course._id)) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    user.coursesEnrolled.push(course._id);
    course.studentsEnrolled.push(user._id);

    await user.save();
    await course.save();

    res.json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

exports.generateCourseContent = async (req, res) => {
  try {
    const { courseId, prompt } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const generatedContent = await generateAIContent(prompt, course.difficulty);

    course.content.push({
      title: prompt,
      body: generatedContent
    });

    await course.save();

    res.json({ message: 'Course content generated successfully', content: generatedContent });
  } catch (error) {
    res.status(500).json({ message: 'Error generating course content', error: error.message });
  }
};