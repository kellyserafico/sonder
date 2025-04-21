import React from 'react';
import { MapIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface LandingProps {
  onExplore: () => void;
}

const Landing: React.FC<LandingProps> = ({ onExplore }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Discover Late Night</span>
                  <span className="block text-purple-400">Food Spots Near You</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Find the best restaurants, cafes, and bars open late in your area. Perfect for night owls and late-night cravings.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <button
                      onClick={onExplore}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out transform hover:scale-105"
                    >
                      Start Exploring 🌙
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Find your perfect late-night spot in three simple steps
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Search Step */}
              <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-600 bg-opacity-20">
                  <MagnifyingGlassIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">Search</h3>
                <p className="mt-2 text-gray-300 text-center">
                  Find open spots near you with location-based search
                </p>
              </div>

              {/* Map Step */}
              <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-600 bg-opacity-20">
                  <MapIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">Map</h3>
                <p className="mt-2 text-gray-300 text-center">
                  Interactive map with late-night spot markers
                </p>
              </div>

              {/* Filter Step */}
              <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-600 bg-opacity-20">
                  <AdjustmentsHorizontalIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">Filter</h3>
                <p className="mt-2 text-gray-300 text-center">
                  Filter by time, cuisine type, and more
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 