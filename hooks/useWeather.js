import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import { fetchCurrent, fetchForecast } from "../utils/api";

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
    
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [c, f] = await Promise.all([fetchCurrent(city), fetchForecast(city)]);
        if (mounted) { setCurrent(c); setForecast(f); }
      } catch (e) { 
        console.warn("Weather fetch error:", e?.message); 
      }
      finally { 
        if (mounted) setLoading(false); 
      }
    })();
    return () => (mounted = false);
  }, [city, locationDetermined]);

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

  return { city, setCity: setCityWithCorrection, current, hourly, daily, loading };
}
