import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import { fetchCurrent, fetchForecast } from "../utils/api";

export default function useWeather(defaultCity = "Colombo") {
  const [city, setCity] = useState(defaultCity);
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  // get city by GPS (best effort)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          if (data?.city) setCity(data.city);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [c, f] = await Promise.all([fetchCurrent(city), fetchForecast(city)]);
        if (mounted) { setCurrent(c); setForecast(f); }
      } catch (e) { console.warn(e?.message); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => (mounted = false);
  }, [city]);

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

  return { city, setCity, current, hourly, daily, loading };
}
