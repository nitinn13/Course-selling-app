import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { userApi, instructorApi } from '../api';
import { UserProfile, InstructorProfile, Course, User } from '../types';
import { Calendar, Book, Users, DollarSign } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Comprehensive logging
      console.group('Profile Fetch Debugging');
      console.log('Authentication State:', {
        isAuthenticated,
        user: user ? {
          id: user.id,
          email: user.email,
          role: user.role
        } : null,
        localStorageToken: localStorage.getItem('token')
      });

      // Validation checks
      if (!isAuthenticated) {
        console.error('❌ Not Authenticated');
        setLoading(false);
        setError('Please log in to view profile');
        console.groupEnd();
        return;
      }

      if (!user) {
        console.error('❌ No User Object');
        setLoading(false);
        setError('User information is missing');
        console.groupEnd();
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // CRITICAL: Explicit role-based API selection
        const profileApi = user.role === 'instructor' 
          ? instructorApi.getProfile 
          : userApi.getProfile;

        console.log(`🔍 Fetching profile with: ${user.role} API`);

        const response = await profileApi();

        console.log('🎉 Profile Response:', response);

        if (!response || !response.data) {
          throw new Error('Invalid profile response');
        }

        setProfile(response.data);
        console.log('✅ Profile Successfully Fetched');
      } catch (err) {
        console.error('❌ Profile Fetch Error:', err);
        
        // More detailed error handling
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch profile. Please check your login status.';
        
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.groupEnd();
      }
    };

    fetchProfile();
  }, [isAuthenticated, user?.role]);          

  const getInitial = (name?: string) => 
    name && name.length > 0 ? name[0].toUpperCase() : '';

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div 
      key={course.id}
      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src={course.imageUrl || '/default-course-image.png'}
        alt={course.title || 'Course Image'}
        className="w-full h-48 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/default-course-image.png';
        }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">
          {course.title || 'Untitled Course'}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {course.description || 'No description available'}
        </p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!isAuthenticated || !profile) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Please log in to view your profile
        </h2>
      </div>
    </div>
  );

  const isInstructor = 'createdCourses' in profile;
  const courses = isInstructor 
    ? (profile as InstructorProfile).createdCourses || []
    : (profile as UserProfile).purchasedCourses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-indigo-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">
                {getInitial(profile.firstName)}
                {getInitial(profile.lastName)}
              </span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">
                {profile.firstName || 'User'} {profile.lastName || ''}
              </h1>
              <p className="text-indigo-100">{profile.email || 'No email'}</p>
              <p className="text-indigo-200 mt-1">
                {isInstructor ? 'Instructor' : 'Student'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-semibold">
                    {profile.joinedDate 
                      ? new Date(profile.joinedDate).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Book className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">
                    {isInstructor ? 'Created Courses' : 'Enrolled Courses'}
                  </p>
                  <p className="font-semibold">
                    {courses.length}
                  </p>
                </div>
              </div>
            </div>

            {isInstructor && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Students</p>
                      <p className="font-semibold">
                        {(profile as InstructorProfile).totalStudents || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="font-semibold">
                        ${(profile as InstructorProfile).totalRevenue?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Course List */}
        <div className="px-6 py-8 border-t">
          <h2 className="text-xl font-semibold mb-6">
            {isInstructor ? 'Created Courses' : 'Enrolled Courses'}
          </h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              {isInstructor 
                ? 'No courses created yet' 
                : 'No courses enrolled yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;