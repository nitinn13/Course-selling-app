const { Router } = require("express");
const userRouter = Router();
const { userModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel } = require("../db");

const {JWT_USER_SECRET} = require("../config")

userRouter.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Validate request body
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

userRouter.get('/purchases', userMiddleware, async (req, res) => {
    const { userId } = req;
    const purchases = await purchaseModel.find({ userId });

    const courseData = await courseModel.find({
        _id : { $in : purchases.map(purchase => purchase.courseId) }
    });
    res.json({ courseData });
});
    
module.exports = { userRouter };
