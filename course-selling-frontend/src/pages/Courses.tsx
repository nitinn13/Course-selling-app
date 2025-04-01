import React, { useEffect, useState } from 'react';
import { courseApi } from '../api';
import type { Course } from '../types';
import { ShoppingCart, Star, Clock } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await courseApi.getAllCourses();
        console.log("API Response:", response);
    
        if (!response?.data?.courses || !Array.isArray(response.data.courses)) {
          throw new Error("Invalid API response format");
        }
    
        setCourses(response.data.courses);
      } catch (err) {
        setError(err.message || "Failed to fetch courses.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const handlePurchase = async (courseId: string) => {
    try {
      await courseApi.purchase(courseId);
      alert('Course purchased successfully!');
    } catch (err) {
      console.error('Error purchasing course:', err);
      alert(err?.message || 'Failed to purchase course. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover expert-led courses designed to enhance your skills and knowledge.
          </p>
        </div>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center max-w-xl mx-auto">
            <h2 className="font-bold mb-2">Oops! Something went wrong</h2>
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-24 w-24 mx-auto text-gray-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
            <p className="text-xl text-gray-500">
              No courses available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${course.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      <span>4.5</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-green-500" />
                      <span>6 Weeks</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePurchase(course.id)}
                    className="w-full flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Purchase Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;