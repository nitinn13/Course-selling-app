import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduHub</span>
            </Link>
            <div className="hidden md:flex md:ml-8 space-x-4">
              <Link to="/courses" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                Courses
              </Link>
              {isAuthenticated && user?.role === 'instructor' && (
                <Link to="/create-course" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                  Create Course
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                  Dashboard
                </Link>
                {user?.role === 'user' && (
                  <Link to="/purchased-courses" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                    My Courses
                  </Link>
                )}
                <div className="relative group">
                  <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                    <User className="w-5 h-5" />
                    <span>{user.firstName}</span>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;