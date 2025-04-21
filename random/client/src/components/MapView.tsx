import React, { useMemo, ReactElement, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Place } from '../services/googlePlaces';

interface MapViewProps {
  center: {
    lat: number;
    lng: number;
  };
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
}

const MapView = ({ center, places, selectedPlace, onPlaceSelect }: MapViewProps): ReactElement => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Fallback to default location (Los Angeles)
          setUserLocation({ lat: 34.0522, lng: -118.2437 });
        }
      );
    }
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = {
    lat: 34.0522,
    lng: -118.2437, // Los Angeles as fallback
  };

  const mapOptions = useMemo(() => ({
    styles: [
      {
        elementType: 'geometry',
        stylers: [{ color: '#242f3e' }],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#242f3e' }],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#746855' }],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
      },
    ],
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  }), []);

  const getMarkerIcon = (isSelected: boolean): string => {
    return isSelected
      ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='36' height='36'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23a855f7' stroke='white' stroke-width='2'/%3E%3C/svg%3E"
      : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='36' height='36'%3E%3Ccircle cx='12' cy='12' r='10' fill='%236366f1' stroke='white' stroke-width='2'/%3E%3C/svg%3E";
  };

  const userMarkerIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='36' height='36'%3E%3Ccircle cx='12' cy='12' r='10' fill='%233b82f6' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='12' r='4' fill='white'/%3E%3C/svg%3E";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl shadow-xl overflow-hidden border border-purple-500/20 backdrop-blur-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Available Spots
          </h2>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center || userLocation || defaultCenter}
                zoom={14}
                options={mapOptions}
              >
                {/* User location marker */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={userMarkerIcon}
                  />
                )}
                
                {/* Place markers */}
                {places.map((place) => (
                  <Marker
                    key={place.place_id}
                    position={{
                      lat: place.geometry.location.lat,
                      lng: place.geometry.location.lng,
                    }}
                    onClick={() => onPlaceSelect(place)}
                    icon={getMarkerIcon(selectedPlace?.place_id === place.place_id)}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>

      {/* Spot listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {places.map((place) => (
          <div
            key={place.place_id}
            onClick={() => onPlaceSelect(place)}
            className={`p-6 rounded-xl border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
              selectedPlace?.place_id === place.place_id
                ? 'bg-gradient-to-br from-purple-800 to-indigo-900 border-purple-500/50'
                : 'bg-gradient-to-br from-gray-900 to-indigo-900/50 border-purple-500/20 hover:border-purple-500/40'
            }`}
          >
            <h3 className="text-xl font-semibold text-white mb-2">{place.name}</h3>
            <p className="text-purple-200/80">{place.vicinity}</p>
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
  );
};

export default MapView; 