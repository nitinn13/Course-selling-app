const {Router} = require("express");
const adminRouter = Router();
const {adminModel, courseModel, courseSectionModel} = require("../db")
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const hashedpass = await bcrypt.hash(password, 5);
    const reqBody = z.object({
        email : z.string().email(),
        password : z.string(),
        firstName : z.string(),
        lastName : z.string()
    })
    const parsed = reqBody.safeParse(req.body)
    if(!parsed.success){
        res.json({
            message : "incorrect format"
        })
        return
    }
    await adminModel.create({email,password : hashedpass,firstName, lastName});
    res.json({
        message : "User registered"
    })

});

adminRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const response = await adminModel.findOne({ email });

    if (!response) {
        return res.status(404).json({ message: "User not found" });
    }

    const passMatch = await bcrypt.compare(password, response.password);

    if (passMatch) {
        const token = jwt.sign({ id:response._id }, JWT_ADMIN_SECRET);
        return res.json({ token });
    } else {
        return res.status(401).json({ message: "Incorrect password" });
    }
});

adminRouter.get('/profile', adminMiddleware, async (req, res) => {
    try {
        const { userId } = req; 
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await adminModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

adminRouter.post('/create-course', adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    const { title , description, imageUrl, price } = req.body

    const course = await courseModel.create({title , description, imageUrl, price, creatorId : adminId})
    res.json({
        message : "course created",
        courseId : course._id
    })
});
adminRouter.put('/update-course', adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    const { title , description, imageUrl, price, courseId } = req.body

    const course = await courseModel.updateOne({
        _id : courseId,
        creatorId : adminId
    },
        {
        title ,
        description,
        imageUrl,
        price,
        
    })
    res.json({
        message : "course created",
        courseId : course._id
    })
});



adminRouter.post('/create-section', adminMiddleware, async (req, res) => {
    try{
        const {title , courseId} = req.body
        const section = await courseSectionModel.create({title , courseId})
        res.json({
            message : "section created",
            sectionId : section._id
        })
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

adminRouter.get('/sections', adminMiddleware, async (req, res) => {
    try{
        const {courseId} = req.body;
        const sections = await courseSectionModel.find({courseId})
        res.json({
            message : "all sections",
            sections
        })
    }
    catch{
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

adminRouter.get('/course/bulk', adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    const courses = await courseModel.find({
        
        creatorId : adminId
    })
    res.json({
        message : "all courses",
        courses
    })
});
module.exports = {
    adminRouter : adminRouter
}