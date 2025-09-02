import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const STORAGE_KEYS = {
  WEATHER_DATA: 'weather_data',
  LAST_UPDATED: 'last_updated',
  LAST_CITY: 'last_city'
};

export class OfflineStorageManager {
  static async saveWeatherData(currentWeather, forecastWeather, city) {
    try {
      const weatherData = {
        current: currentWeather,
        forecast: forecastWeather,
        city: city,
        timestamp: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.WEATHER_DATA, JSON.stringify(weatherData));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CITY, city);
      
      console.log('Weather data saved to offline storage');
    } catch (error) {
      console.error('Error saving weather data to offline storage:', error);
    }
  }

  static async getOfflineWeatherData() {
    try {
      const weatherDataString = await AsyncStorage.getItem(STORAGE_KEYS.WEATHER_DATA);
      const lastUpdated = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
      const lastCity = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CITY);
      
      if (weatherDataString) {
        const weatherData = JSON.parse(weatherDataString);
        return {
          ...weatherData,
          lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
          lastCity: lastCity
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving offline weather data:', error);
      return null;
    }
  }

  static async getLastUpdated() {
    try {
      const lastUpdated = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
      return lastUpdated ? new Date(lastUpdated) : null;
    } catch (error) {
      console.error('Error retrieving last updated time:', error);
      return null;
    }
  }

  static async clearOfflineData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.WEATHER_DATA,
        STORAGE_KEYS.LAST_UPDATED,
        STORAGE_KEYS.LAST_CITY
      ]);
      console.log('Offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }

  static async isOnline() {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected && state.isInternetReachable;
    } catch (error) {
      console.error('Error checking network state:', error);
      return false;
    }
  }

  static formatLastUpdated(date) {
    if (!date) return 'Never updated';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) {
      return 'Updated a moment ago';
    } else if (diffInMinutes < 60) {
      return `Updated ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `Updated ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `Updated ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return `Last updated on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  static formatOfflineMessage(lastUpdated) {
    if (!lastUpdated) return 'No offline data available';
    
    return `Last online update: ${lastUpdated.toLocaleDateString()} at ${lastUpdated.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }
}
