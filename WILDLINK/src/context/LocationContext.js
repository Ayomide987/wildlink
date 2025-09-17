import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission',
          'WildLink needs location access to show nearby wildlife and connect you with local conservationists.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setLoading(false);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Get address from coordinates
      let addressInfo = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const locationData = {
        coords: currentLocation.coords,
        address: addressInfo[0] || {},
        timestamp: currentLocation.timestamp,
      };

      setLocation(locationData);
    } catch (error) {
      console.error('Error getting location:', error);
      // Set default location for demo purposes
      setLocation({
        coords: {
          latitude: 6.5244,  // Lagos, Nigeria
          longitude: 3.3792,
          accuracy: 100,
        },
        address: {
          city: 'Lagos',
          region: 'Lagos',
          country: 'Nigeria',
        },
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    if (locationPermission === 'granted') {
      await getCurrentLocation();
    }
  };

  // Get nearby wildlife data based on location
  const getNearbyWildlife = () => {
    if (!location) return [];

    // Mock nearby wildlife data based on location
    const nearbyWildlife = [
      {
        id: '1',
        name: 'African Fish Eagle',
        scientificName: 'Haliaeetus vocifer',
        distance: '2.3 km',
        lastSeen: '2 hours ago',
        rarity: 'Common',
        image: 'https://example.com/african-fish-eagle.jpg',
        coordinates: {
          latitude: location.coords.latitude + 0.01,
          longitude: location.coords.longitude + 0.01,
        }
      },
      {
        id: '2',
        name: 'Pied Kingfisher',
        scientificName: 'Ceryle rudis',
        distance: '1.8 km',
        lastSeen: '4 hours ago',
        rarity: 'Common',
        image: 'https://example.com/pied-kingfisher.jpg',
        coordinates: {
          latitude: location.coords.latitude - 0.005,
          longitude: location.coords.longitude + 0.008,
        }
      },
      {
        id: '3',
        name: 'West African Manatee',
        scientificName: 'Trichechus senegalensis',
        distance: '5.2 km',
        lastSeen: '1 day ago',
        rarity: 'Rare',
        image: 'https://example.com/west-african-manatee.jpg',
        coordinates: {
          latitude: location.coords.latitude + 0.02,
          longitude: location.coords.longitude - 0.01,
        }
      },
    ];

    return nearbyWildlife;
  };

  const value = {
    location,
    locationPermission,
    loading,
    requestLocationPermission,
    getCurrentLocation,
    updateLocation,
    getNearbyWildlife,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};