import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import useWeather from "../hooks/useWeather";
import ForecastPills from "../components/ForecastPills";
import HourlyChart from "../components/HourlyChart";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import MetricTile from "../components/MetricTile";
import { OfflineStorageManager } from "../utils/offlineStorage";

export default function ForecastScreen() {
  const { isDark } = useTheme();
  const { city, daily, hourly, current, isOfflineMode, lastUpdated, isAutoRefreshing } = useWeather();

  const humidity = current?.main?.humidity ?? "-";

  const getStatusText = () => {
    if (isAutoRefreshing) {
      return "Updating data...";
    } else if (isOfflineMode && lastUpdated) {
      return OfflineStorageManager.formatOfflineMessage(lastUpdated);
    } else if (lastUpdated) {
      return OfflineStorageManager.formatLastUpdated(lastUpdated);
    } else {
      return "Updated a moment ago";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0b0b0d" : "#eaf4ff" }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 54 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
            Your Forecast • {city}
          </Text>
          {isOfflineMode && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>OFFLINE</Text>
            </View>
          )}
          {isAutoRefreshing && (
            <View style={styles.refreshingBadge}>
              <Text style={styles.refreshingBadgeText}>REFRESHING</Text>
            </View>
          )}
        </View>
        
        {(isOfflineMode || isAutoRefreshing) && (
          <Text style={[styles.offlineStatus, { color: isDark ? "#fbbf24" : "#d97706" }]}>
            {getStatusText()}
          </Text>
        )}

        <View style={{ marginTop: 14 }}>
          <CurrentWeatherCard city={city} current={current} />
        </View>

        <ForecastPills items={daily} />
        <HourlyChart items={hourly} />

        <View style={styles.grid}>
          <MetricTile label="Visibility" value={current?.visibility} unit="mi" />
          <MetricTile label="Pressure" value={current?.main?.pressure} unit="hPa" />
        </View>

        <View style={styles.grid}>
          <MetricTile label="Humidity" value={humidity} unit="%" />
          <MetricTile label="Wind" value={current?.wind?.speed ?? "-"} unit="m/s" />
        </View>

        <View style={styles.grid}>
          <MetricTile label="Wind Gust" value={current?.wind?.gust ?? "-"} unit="m/s" />
          <MetricTile label="Clouds" value={current?.clouds?.all ?? "-"} unit="%" />
        </View>

        <View style={styles.grid}>
          <MetricTile label="Wind Direction" value={current?.wind?.deg ?? "-"} unit="°" />
          <MetricTile label="Feels Like" value={current?.main?.feels_like ?? "-"} unit="°F" />
        </View>

        <View style={styles.grid}>
          <MetricTile label="Max Temp" value={current?.main?.temp_max ?? "-"} unit="°F" />
          <MetricTile label="Min Temp" value={current?.main?.temp_min ?? "-"} unit="°F" />
        </View>

        <View style={styles.grid}>
          <MetricTile label="Sunrise" value={current?.sys?.sunrise ? new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"} unit="" />
          <MetricTile label="Sunset" value={current?.sys?.sunset ? new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"} unit="" />
        </View>

        <View style={styles.grid}>
          <MetricTile
            label="Snow Volume"
            value={current?.snow?.["1h"] ?? "0"}
            unit="mm/h"
            status={current?.snow?.["1h"] ? "Active" : "None"}
          />
          <MetricTile
            label="Rain Volume"
            value={current?.rain?.["1h"] ?? "0"}
            unit="mm/h"
            status={current?.rain?.["1h"] ? "Active" : "None"}
          />
        </View>

        <View style={styles.grid}>
          <MetricTile label="Sea Level" value={current?.main?.sea_level ?? "-"} unit="hPa" />
          <MetricTile label="Ground Level" value={current?.main?.grnd_level ?? "-"} unit="hPa" />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 8 },
  grid: { flexDirection: "row", gap: 12, marginTop: 14 },
  offlineBadge: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  offlineBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  refreshingBadge: {
    backgroundColor: "#059669",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  refreshingBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  offlineStatus: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "500",
  },
});
