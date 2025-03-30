import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../api';
import type { Course } from '../types';

const PurchasedCourses = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'user') {
      navigate('/login');
      return;
    }

    const fetchPurchasedCourses = async () => {
      try {
        const coursesData = await userApi.getPurchases();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching purchased courses:', error);
      }
    };
    fetchPurchasedCourses();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'user') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't purchased any courses yet.</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 font-semibold">
                    Instructor: {course.instructor}
                  </span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md">
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasedCourses;