export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'instructor';
  purchasedCourses?: string[];
  createdCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  creatorId: string;
  instructor?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  curriculum?: {
    title: string;
    description: string;
  }[];
  duration?: string;
  level?: string;
  category?: string;
  rating?: number;
  enrolledStudents?: number;
}

export interface Purchase {
  userId: string;
  courseId: string;
  purchaseDate: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  purchasedCourses: Course[];
  joinedDate: string;
}

export interface InstructorProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdCourses: Course[];
  totalStudents: number;
  totalRevenue: number;
  joinedDate: string;
}