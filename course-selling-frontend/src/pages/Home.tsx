import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, PlayCircle, Download } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 pt-12 md:pt-16 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl">
              <div className="sm:text-center lg:text-left">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block text-indigo-600">Elevate Your Skills</span>
                    <span className="block text-gray-900 mt-2">Learn. Grow. Succeed.</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-center lg:text-left">
                    Unlock your potential with expert-led courses designed to transform your career and boost your expertise.
                  </p>
                  <div className="mt-8 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="rounded-lg shadow-md">
                      <Link
                        to="/courses"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                      >
                        Explore Courses
                      </Link>
                    </div>
                    <div>
                      <Link
                        to="/signup"
                        className="w-full flex items-center justify-center px-8 py-3 border border-indigo-300 text-base font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-300"
                      >
                        Start Learning
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Visual Element Replacement */}
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-indigo-100 opacity-75"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transform -translate-x-12 rotate-3">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-indigo-50 p-4 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Career Growth</h3>
                    <p className="text-sm text-gray-600">Accelerate your professional development</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-xl">
                  <PlayCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Interactive Learning</h3>
                    <p className="text-sm text-gray-600">Engaging video lessons</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-purple-50 p-4 rounded-xl">
                  <Download className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Lifetime Access</h3>
                    <p className="text-sm text-gray-600">Learn at your own pace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Commitment</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your Success, Our Priority
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mb-4 p-4 rounded-full bg-indigo-100">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Content</h3>
              <p className="text-gray-600">
                Expertly designed courses that align with industry standards and emerging trends.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mb-4 p-4 rounded-full bg-green-100">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">World-Class Instructors</h3>
              <p className="text-gray-600">
                Learn from industry leaders with real-world experience and proven track records.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mb-4 p-4 rounded-full bg-purple-100">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Recognition</h3>
              <p className="text-gray-600">
                Earn verifiable certificates that showcase your newly acquired skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;