import React, { FC } from 'react';
import { Place } from '../services/googlePlaces';
import { ClockIcon } from '@heroicons/react/24/outline';

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
    <div className="w-full h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/50 hover:scrollbar-thumb-purple-500/70">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
          Available Spots
        </h2>
        <div className="space-y-4">
          {places.map((place) => (
            <div
              key={place.place_id}
              onClick={() => onPlaceSelect(place)}
              className={`group p-4 rounded-xl border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                selectedPlace?.place_id === place.place_id
                  ? 'border-purple-500/50 bg-purple-900/30'
                  : 'border-purple-500/20 hover:border-purple-500/40 bg-purple-900/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {place.name}
                </h3>
                <div className="flex space-x-2">
                  {place.opening_hours?.open_now && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-900/30 text-green-400 rounded-full border border-green-500/30">
                      Open Now
                    </span>
                  )}
                  {isOpenLate(place) && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-900/30 text-purple-400 rounded-full border border-purple-500/30 flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      Late Night
                    </span>
                  )}
                </div>
              </div>
              <p className="text-purple-200/80 mt-1 group-hover:text-purple-200 transition-colors">
                {place.vicinity}
              </p>
              {place.rating && (
                <div className="mt-3 flex items-center">
                  <div className="flex items-center bg-yellow-900/30 px-2 py-1 rounded-full border border-yellow-500/30">
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