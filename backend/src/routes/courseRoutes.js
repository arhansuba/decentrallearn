const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['instructor', 'admin']), courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseById);
router.put('/:courseId', authMiddleware, roleMiddleware(['instructor', 'admin']), courseController.updateCourse);
router.delete('/:courseId', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);
router.post('/:courseId/enroll', authMiddleware, courseController.enrollInCourse);
router.post('/generate-content', authMiddleware, roleMiddleware(['instructor', 'admin']), courseController.generateCourseContent);

module.exports = router;
