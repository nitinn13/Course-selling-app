const {Router} = require("express");
const courseRouter = Router();
const {courseModel, purchaseModel} = require("../db");
const {userMiddleware} = require("../middleware/user");
const mongoose = require("mongoose");

// courseRouter.get('/:id', async (req, res) => {
//   try {
//       const { id } = req.params;
//       const course = await courseModel.findById(id);
      
//       if (!course) {
//           return res.status(404).json({ message: "Course not found" });
//       }

//       res.json(course);
//   } catch (error) {
//       res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
  const { userId, courseId} = req.body;
  await purchaseModel.create({ userId, courseId });
  res.json({ message: "Purchase successful" });
});


courseRouter.get('/completed', userMiddleware, async (req, res) => {
  try {
      const { userId } = req.body;
      const completedCourses = await courseModel.find({ completed: true, userId });

      res.json({ courses: completedCourses });
  } catch (error) {
      console.error("Error fetching completed courses:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

courseRouter.post('/completed/:courseId', userMiddleware, async (req, res) => {
  try {
      const { courseId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
          return res.status(400).json({ message: "Invalid course ID" });
      }

      const course = await courseModel.findById(courseId);
      if (!course) {
          return res.status(404).json({ message: "Course not found" });
      }

      course.completed = true;
      await course.save();
      res.json({ message: "Course completed successfully" });
  } catch (error) {
      console.error("Error marking course as completed:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

courseRouter.get('/preview', async (req, res) => {
  const courses = await courseModel.find({});
  res.json({courses});
});

courseRouter.get('/:courseId', async (req, res) => {
  try {
      if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
          return res.status(400).json({ message: "Invalid course ID" });
      }

      const course = await courseModel.findById(req.params.courseId);

      if (!course) {
          return res.status(404).json({ message: "Course not found" });
      }

      res.json({ course });
  } catch (error) {
      console.error("Error fetching course details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
//delte course
//section in course
//lesson in section
//video upload
//fetch lesson
//payment


module.exports = {
    courseRouter : courseRouter
}