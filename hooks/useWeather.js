import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import { fetchCurrent, fetchForecast, InvalidCityError } from "../utils/api";
import { OfflineStorageManager } from "../utils/offlineStorage";
import NetInfo from '@react-native-community/netinfo';

// City name corrections for common geocoding vs weather API mismatches
const correctCityName = (cityName) => {
  const cityCorrections = {
    "Kuruvita": "Kuruwita",
    "kuruvita": "Kuruwita",
    // Add more corrections here as needed
    "Colombo": "Colombo",
    "Kandy": "Kandy",
    "Galle": "Galle",
  };
  
  // Return corrected name if exists, otherwise return original
  return cityCorrections[cityName] || cityName;
};

export default function useWeather(defaultCity = "Colombo") {
  const [city, setCity] = useState(null); // Start with null to show we're determining location
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationDetermined, setLocationDetermined] = useState(false);
  const [error, setError] = useState(null); // New state for error handling
  const [suggestions, setSuggestions] = useState([]); // New state for city suggestions
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  // Separate function for fetching weather data (for auto-refresh)
  const fetchWeatherData = async (cityName, isAutoRefresh = false) => {
    if (!cityName || !isOnline) return;
    
    if (isAutoRefresh) {
      setIsAutoRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    setSuggestions([]);
    
    try {
      console.log('Fetching weather data for:', cityName);
      const [c, f] = await Promise.all([fetchCurrent(cityName), fetchForecast(cityName)]);
      
      setCurrent(c);
      setForecast(f);
      setError(null);
      setSuggestions([]);
      setIsOfflineMode(false);
      
      // Save to offline storage
      await OfflineStorageManager.saveWeatherData(c, f, cityName);
      setLastUpdated(new Date());
      
      console.log('Weather data refreshed successfully');
    } catch (e) {
      console.warn("Weather fetch error:", e?.message);
      
      if (e instanceof InvalidCityError) {
        setError(`City "${e.cityName}" not found. Did you mean one of these?`);
        setSuggestions(e.suggestions);
      } else {
        // Network error - try to load offline data
        console.log('Network error, attempting to load offline data');
        const offlineData = await OfflineStorageManager.getOfflineWeatherData();
        if (offlineData) {
          setCurrent(offlineData.current);
          setForecast(offlineData.forecast);
          setLastUpdated(offlineData.lastUpdated);
          setIsOfflineMode(true);
          setError("Using offline data. Check your internet connection.");
        } else {
          setError("Unable to fetch weather data and no offline data available.");
        }
      }
    } finally {
      if (isAutoRefresh) {
        setIsAutoRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Network connectivity monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      const wasOffline = isOfflineMode;
      
      setIsOnline(online);
      
      if (!online && !isOfflineMode) {
        // Going offline
        setIsOfflineMode(true);
        console.log('Device went offline, switching to offline mode');
      } else if (online && isOfflineMode) {
        // Coming back online - trigger auto refresh
        console.log('Device came back online, auto-refreshing data');
        setIsOfflineMode(false);
        
        // Auto-refresh weather data when coming back online
        if (city && locationDetermined) {
          console.log('Auto-refreshing weather data for:', city);
          // Trigger a refresh by setting a flag or calling fetch directly
          setTimeout(() => {
            // Small delay to ensure connection is stable
            fetchWeatherData(city, true); // true indicates this is an auto-refresh
          }, 1000);
        }
      }
    });

    // Initial network state check
    NetInfo.fetch().then(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      if (!online) {
        setIsOfflineMode(true);
      }
    });

    return () => unsubscribe();
  }, [isOfflineMode, city, locationDetermined]);

  // Load offline data on app start
  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        const offlineData = await OfflineStorageManager.getOfflineWeatherData();
        if (offlineData && (!isOnline || !current)) {
          console.log('Loading offline weather data');
          setCurrent(offlineData.current);
          setForecast(offlineData.forecast);
          setCity(offlineData.city);
          setLastUpdated(offlineData.lastUpdated);
          setLocationDetermined(true);
          
          if (!isOnline) {
            setIsOfflineMode(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };

    loadOfflineData();
  }, []);

  // get city by GPS (priority), fallback to default city
  useEffect(() => {
    (async () => {
      try {
        // First, try to get GPS location
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Location permission status:", status);
        
        if (status === "granted") {
          try {
            // Try with less strict accuracy first
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Low, // Changed from Balanced to Low for better compatibility
              timeout: 15000, // Increased timeout to 15 seconds
              maximumAge: 300000, // Accept cached location up to 5 minutes old
            });
            
            console.log("GPS coordinates:", loc.coords.latitude, loc.coords.longitude);
            
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&localityLanguage=en`
            );
            const data = await res.json();
            console.log("Reverse geocoding result:", data);
            
            if (data?.city) {
              const originalCity = data.city;
              const correctedCity = correctCityName(originalCity);
              console.log("GPS location found:", originalCity);
              if (originalCity !== correctedCity) {
                console.log("City name corrected from:", originalCity, "to:", correctedCity);
              }
              setCity(correctedCity);
              setLocationDetermined(true);
              return; // GPS location found, exit here
            } else {
              console.warn("No city found in reverse geocoding result");
            }
          } catch (gpsError) {
            console.warn("GPS location failed:", gpsError.message);
            
            // Try with even lower accuracy as fallback
            try {
              console.log("Trying with lowest accuracy...");
              const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Lowest,
                timeout: 20000,
                maximumAge: 600000, // Accept cached location up to 10 minutes old
              });
              
              console.log("GPS coordinates (low accuracy):", loc.coords.latitude, loc.coords.longitude);
              
              const res = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&localityLanguage=en`
              );
              const data = await res.json();
              
              if (data?.city) {
                const originalCity = data.city;
                const correctedCity = correctCityName(originalCity);
                console.log("GPS location found (low accuracy):", originalCity);
                if (originalCity !== correctedCity) {
                  console.log("City name corrected from:", originalCity, "to:", correctedCity);
                }
                setCity(correctedCity);
                setLocationDetermined(true);
                return;
              }
            } catch (secondGpsError) {
              console.warn("Second GPS attempt failed:", secondGpsError.message);
            }
          }
        } else {
          console.warn("Location permission denied");
        }
        
        // If GPS fails or permission denied, use default city
        console.log("Using default city:", defaultCity);
        setCity(defaultCity);
        setLocationDetermined(true);
      } catch (error) {
        console.warn("Location determination failed:", error.message);
        // Final fallback to default city
        setCity(defaultCity);
        setLocationDetermined(true);
      }
    })();
  }, [defaultCity]);

  useEffect(() => {
    // Only fetch weather data after location is determined and city is set
    if (!locationDetermined || !city) return;
    
    // If offline, don't attempt to fetch new data
    if (!isOnline && isOfflineMode) {
      console.log('Offline mode: skipping weather fetch');
      return;
    }
    
    let mounted = true;
    
    const performFetch = async () => {
      await fetchWeatherData(city);
    };
    
    performFetch();
    
    return () => (mounted = false);
  }, [city, locationDetermined, isOnline]);

  // next 8 three-hour points for "hourly" chart
  const hourly = useMemo(() => (forecast ? forecast.list.slice(0, 8) : []), [forecast]);

  // pick one item around 12:00 for the next 4 days
  const daily = useMemo(() => {
    if (!forecast) return [];
    const byDay = {};
    forecast.list.forEach((it) => {
      const day = it.dt_txt.split(" ")[0];
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(it);
    });
    return Object.entries(byDay)
      .slice(0, 4)
      .map(([date, arr]) => {
        const noon = arr.find((a) => a.dt_txt.includes("12:00:00")) || arr[Math.floor(arr.length / 2)];
        return { date, temp: noon.main.temp, icon: noon.weather[0].icon, pop: noon.pop };
      });
  }, [forecast]);

  // Wrapper function for setCity that applies name corrections
  const setCityWithCorrection = (cityName) => {
    const correctedCity = correctCityName(cityName);
    if (cityName !== correctedCity) {
      console.log("Manual city name corrected from:", cityName, "to:", correctedCity);
    }
    setCity(correctedCity);
  };

  // Function to clear error state
  const clearError = () => {
    setError(null);
    setSuggestions([]);
  };

  return { 
    city, 
    setCity: setCityWithCorrection, 
    current, 
    hourly, 
    daily, 
    loading, 
    error, 
    suggestions,
    clearError,
    isOnline,
    isOfflineMode,
    lastUpdated,
    isAutoRefreshing
  };
}
