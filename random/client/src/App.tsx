import React, { useState, useEffect, ReactElement } from 'react';
import MapView from './components/MapView';
import SpotList from './components/SpotList';
import Landing from './components/Landing';
import { Place, searchNearbyPlaces } from './services/googlePlaces';

type PlaceType = 'restaurant' | 'cafe' | 'bar';

const App = (): ReactElement => {
  const [showExplorer, setShowExplorer] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError('Unable to retrieve your location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (location && showExplorer) {
        setLoading(true);
        try {
          const results = await searchNearbyPlaces(location, placeType);
          setPlaces(results);
          setError(null);
        } catch (err) {
          setError('Failed to fetch places');
          console.error('Error fetching places:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPlaces();
  }, [location, placeType, showExplorer]);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setShowModal(true);
  };

  const handlePlaceTypeChange = (type: PlaceType) => {
    setPlaceType(type);
    setSelectedPlace(null);
    setShowModal(false);
  };

  if (!showExplorer) {
    return <Landing onExplore={() => setShowExplorer(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-950">
      <header className="bg-black/30 backdrop-blur-lg shadow-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Explore Late Night Spots
              </h1>
              <p className="mt-2 text-purple-300 text-lg">
                Tap a category to discover what's open near you
              </p>
            </div>
            <button
              onClick={() => setShowExplorer(false)}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {(['restaurant', 'cafe', 'bar'] as PlaceType[]).map((type) => (
              <button
                key={type}
                onClick={() => handlePlaceTypeChange(type)}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  placeType === type
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-900 text-gray-300 border border-purple-500/20 hover:bg-gray-800'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 backdrop-blur-lg text-red-200 rounded-xl border border-red-500/30">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl shadow-xl overflow-hidden border border-purple-500/20 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:border-purple-500/40">
            <SpotList
              places={places}
              selectedPlace={selectedPlace}
              onPlaceSelect={handlePlaceSelect}
            />
          </div>
          <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl shadow-xl overflow-hidden border border-purple-500/20 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:border-purple-500/40">
            {loading ? (
              <div className="flex items-center justify-center h-[600px]">
                <div className="relative">
                  <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
                  <div className="w-16 h-16 border-t-4 border-b-4 border-pink-500 rounded-full animate-spin absolute top-0 left-0" style={{ animationDelay: '-0.3s' }}></div>
                </div>
              </div>
            ) : (
              <div className="h-[600px]">
                <MapView
                  center={location || { lat: 40.7128, lng: -74.0060 }}
                  places={places}
                  selectedPlace={selectedPlace}
                  onPlaceSelect={handlePlaceSelect}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Place Details Modal */}
      {showModal && selectedPlace && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl max-w-lg w-full p-6 relative border border-purple-500/30 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">{selectedPlace.name}</h2>
            <p className="text-purple-200 mb-4">{selectedPlace.vicinity}</p>
            {selectedPlace.rating && (
              <div className="flex items-center mb-4">
                <div className="flex items-center bg-yellow-900/50 px-3 py-1 rounded-full border border-yellow-500/30">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-yellow-100">{selectedPlace.rating.toFixed(1)}</span>
                </div>
              </div>
            )}
            {selectedPlace.opening_hours?.open_now && (
              <div className="inline-block bg-green-900/50 px-3 py-1 rounded-full border border-green-500/30">
                <span className="text-green-400">Open Now</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
