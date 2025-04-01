const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
}, { timestamps: true });

const adminSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
}, { timestamps: true });

const courseSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String,
    creatorId: { type: Schema.Types.ObjectId, ref: 'admins', required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'reviews' }]  
}, { timestamps: true });

const courseSectionSchema = new Schema({
    title: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'lessons' }]  
}, { timestamps: true });

const purchaseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' }
}, { timestamps: true });

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);
const adminModel = mongoose.model('admins', adminSchema);
const courseModel = mongoose.model('courses', courseSchema);
const purchaseModel = mongoose.model('purchases', purchaseSchema);
const courseSectionModel = mongoose.model('courseSections', courseSectionSchema);
const reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel,
    courseSectionModel,
    reviewModel
};
