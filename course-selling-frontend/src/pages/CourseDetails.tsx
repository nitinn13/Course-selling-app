import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseApi } from '../api';
import { Course } from '../types';
import { Clock, BookOpen, Users, Award, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await courseApi.getCourseDetails(courseId!);
        setCourse(response.data);
      } catch (err) {
        setError(err?.message || 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setPurchasing(true);
      await courseApi.purchase(courseId!);
      navigate('/purchased-courses');
    } catch (err) {
      alert(err?.message || 'Failed to purchase course');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error || 'Course not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
          
          <div className="aspect-video mb-6">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About This Course</h2>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>{course.duration || '8 hours'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{course.level || 'Beginner'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>{course.enrolledStudents || 0} students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>{course.rating || 4.5} rating</span>
              </div>
            </div>
          </div>

          {course.curriculum && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Course Curriculum</h2>
              <div className="space-y-4">
                {course.curriculum.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Course Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="text-3xl font-bold text-gray-900 mb-4">
              ${course.price}
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium
                ${purchasing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'}
              `}
            >
              {purchasing ? 'Processing...' : 'Enroll Now'}
            </button>

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Full lifetime access</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Access on mobile and desktop</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Certificate of completion</span>
              </div>
            </div>

            {course.instructor && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Instructor</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">
                      {course.instructor.firstName[0]}
                      {course.instructor.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {course.instructor.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;