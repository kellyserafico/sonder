import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
  version: 'weekly',
  libraries: ['places']
});

export interface Place {
  name: string;
  place_id: string;
  rating?: number;
  vicinity: string;
  opening_hours?: {
    open_now: boolean;
    periods?: Array<{
      close: { day: number; time: string };
      open: { day: number; time: string };
    }>;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

type PlaceType = 'restaurant' | 'cafe' | 'bar';

export const searchNearbyPlaces = async (
  location: { lat: number; lng: number },
  type: PlaceType = 'restaurant',
  radius: number = 5000
): Promise<Place[]> => {
  try {
    const google = await loader.load();
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    return new Promise((resolve, reject) => {
      service.nearbySearch(
        {
          location,
          radius,
          type,
          openNow: true,
        },
        (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const places: Place[] = results.map((place) => {
              const location = place.geometry?.location;
              return {
                name: place.name || '',
                place_id: place.place_id || '',
                rating: place.rating,
                vicinity: place.vicinity || '',
                opening_hours: place.opening_hours ? {
                  open_now: place.opening_hours.isOpen() || false,
                  periods: place.opening_hours.periods?.map(period => ({
                    close: {
                      day: period.close?.day || 0,
                      time: period.close?.time || '0000'
                    },
                    open: {
                      day: period.open?.day || 0,
                      time: period.open?.time || '0000'
                    }
                  }))
                } : undefined,
                geometry: {
                  location: {
                    lat: location?.lat() || 0,
                    lng: location?.lng() || 0,
                  },
                },
              };
            });
            resolve(places);
          } else {
            reject(new Error(`Failed to fetch places: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    throw error;
  }
};

export const getPlaceDetails = async (placeId: string): Promise<Place> => {
  try {
    const google = await loader.load();
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId,
          fields: ['name', 'rating', 'vicinity', 'opening_hours', 'geometry'],
        },
        (result: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            const location = result.geometry?.location;
            resolve({
              name: result.name || '',
              place_id: result.place_id || '',
              rating: result.rating,
              vicinity: result.vicinity || '',
              opening_hours: result.opening_hours ? {
                open_now: result.opening_hours.isOpen() || false,
                periods: result.opening_hours.periods?.map(period => ({
                  close: {
                    day: period.close?.day || 0,
                    time: period.close?.time || '0000'
                  },
                  open: {
                    day: period.open?.day || 0,
                    time: period.open?.time || '0000'
                  }
                }))
              } : undefined,
              geometry: {
                location: {
                  lat: location?.lat() || 0,
                  lng: location?.lng() || 0,
                },
              },
            });
          } else {
            reject(new Error(`Failed to fetch place details: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    throw error;
  }
}; 