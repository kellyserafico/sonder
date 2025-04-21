import React, { FC, ReactNode } from 'react';
import { Place } from '../services/googlePlaces';

interface SpotListProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
}

const SpotList: FC<SpotListProps> = ({ places, selectedPlace, onPlaceSelect }) => {
  const isOpenLate = (place: Place) => {
    if (!place.opening_hours?.periods) return false;
    return place.opening_hours.periods.some(
      (period) => parseInt(period.close.time) >= 2200 // 10:00 PM
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
          Late Night Spots
        </h2>
        <div className="space-y-4">
          {places.map((place) => (
            <div
              key={place.place_id}
              className={`group p-4 rounded-xl border transition-all duration-300 transform hover:scale-102 cursor-pointer ${
                selectedPlace?.place_id === place.place_id
                  ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                  : 'border-gray-800 hover:border-gray-700 bg-gray-900 bg-opacity-40'
              }`}
              onClick={() => onPlaceSelect(place)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {place.name}
                </h3>
                <div className="flex space-x-2">
                  {place.opening_hours?.open_now && (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-900 bg-opacity-50 text-green-400 rounded-full">
                      Open Now
                    </span>
                  )}
                  {isOpenLate(place) && (
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-900 bg-opacity-50 text-purple-400 rounded-full">
                      Late Night
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-400 mt-1 group-hover:text-gray-300">
                {place.vicinity}
              </p>
              {place.rating && (
                <div className="mt-3 flex items-center">
                  <div className="flex items-center bg-yellow-900 bg-opacity-30 px-2 py-1 rounded-full">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-yellow-100">
                      {place.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotList; 