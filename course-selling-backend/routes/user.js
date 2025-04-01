const { Router } = require("express");
const userRouter = Router();
const { userModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const { z, object } = require("zod");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel } = require("../db");
const mongoose = require("mongoose");
const {JWT_USER_SECRET} = require("../config")

userRouter.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    const reqBody = z.object({
        email: z.string().email(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string()
    });

    
    const parsed = reqBody.safeParse(req.body);
    if (!parsed.success) {
        return res.json({ message: "Incorrect format" });
    }

    // Hash password
    const hashedpass = await bcrypt.hash(password, 5);

    // Save user with correct password field
    await userModel.create({ email, password: hashedpass, firstName, lastName });

    res.json({ message: "User registered" });
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const response = await userModel.findOne({ email });

    if (!response) {
        return res.status(404).json({ message: "User not found" });
    }

    const passMatch = await bcrypt.compare(password, response.password);

    if (passMatch) {
        const token = jwt.sign({ id: response._id }, JWT_USER_SECRET);
        return res.json({ token });
    } else {
        return res.status(401).json({ message: "Incorrect password" });
    }
});

userRouter.get('/profile', userMiddleware, async (req, res) => {
    try {
        const { userId } = req; 
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

userRouter.get('/my-courses', userMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        
        const purchases = await purchaseModel.find({ userId }).lean();
        
        if (!purchases.length) {
            return res.status(404).json({ message: "No courses found" });
        }

        const courseIds = purchases.map(purchase => new mongoose.Types.ObjectId(purchase.courseId));

        const courses = await courseModel.find({ _id: { $in: courseIds } }).lean();

        res.json({ courses });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

userRouter.post('/complete-a-course/:courseId', userMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const { userId } = req;

        const purchase = await purchaseModel.findOne({
            userId,
            courseId: new mongoose.Types.ObjectId(courseId) 
        });

        if (!purchase) {
            return res.status(404).json({ message: "Course not found or not purchased" });
        }

        if (purchase.completed) {
            return res.status(400).json({ message: "Course already completed" });
        }

        purchase.completed = true;
        await purchase.save();

        res.json({ message: "Course completed successfully" });
    } catch (error) {
        console.error("Error in complete-a-course:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

userRouter.get('/completed-courses', userMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const completedCourses = await purchaseModel.find({ userId, completed: true }).lean();

        if (!completedCourses.length) {
            return res.status(404).json({ message: "No completed courses found" });
        }

        res.json({ completedCourses });
    } catch (error) {
        console.error("Error in completed-courses:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
// const mongoose = require('mongoose');

userRouter.post('/review', userMiddleware, async (req, res) => {
    try {
        
        const { userId } = req; 
        const { rating, comment, courseId } = req.body;

        

        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const purchase = await purchaseModel.findOne({ userId, courseId });
        if (!purchase) {
            return res.status(403).json({ message: "You need to purchase the course to leave a review" });
        }
        const objectIdCourseId = new mongoose.Types.ObjectId(courseId);
        const objectIdUserId = new mongoose.Types.ObjectId(userId);
        
        const review = {
            userId : objectIdUserId,
            courseId : objectIdCourseId,
            rating,
            comment,
            
        };

        course.reviews.push(review);
        await course.save();

        res.json({ message: "Review submitted successfully" });
    } catch (error) {
        console.error("Error in review route:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



module.exports = { userRouter };
