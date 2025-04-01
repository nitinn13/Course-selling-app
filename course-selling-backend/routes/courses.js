const {Router} = require("express");
const courseRouter = Router();
const {courseModel, purchaseModel, courseSectionModel} = require("../db");
const {userMiddleware} = require("../middleware/user");
const mongoose = require("mongoose");

courseRouter.get('/preview', async (req, res) => {
  const courses = await courseModel.find({});
  res.json({courses});
});

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { courseId } = req.body;

    const objectIdCourseId = new mongoose.Types.ObjectId(courseId);

    const courseExists = await courseModel.findById(objectIdCourseId);
    if (!courseExists) {
        return res.status(404).json({ message: "Course not found" });
    }

    const alreadyPurchased = await purchaseModel.findOne({ userId, courseId: objectIdCourseId });
    if (alreadyPurchased) {
        return res.status(400).json({ message: "Course already purchased" });
    }

    await purchaseModel.create({ userId, courseId: objectIdCourseId, completed: false });

    res.json({ message: "Purchase successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
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
//lesson in section
//video upload
//fetch lesson
//payment

module.exports = {
    courseRouter : courseRouter
}