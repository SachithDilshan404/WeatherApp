import React from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useWeather from "../hooks/useWeather";
import SearchBar from "../components/SearchBar";
import Toggle from "../components/Toggle";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import ForecastPills from "../components/ForecastPills";
import HourlyChart from "../components/HourlyChart";
import MetricTile from "../components/MetricTile";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen() {
  const { isDark, setIsDark } = useTheme();
  const { city, setCity, current, hourly, daily, loading } = useWeather();

  const visibility = current?.visibility ? (current.visibility / 1609).toFixed(1) : "-";
  const pressure = current?.main?.pressure ?? "-";

  return (
    <LinearGradient
      colors={isDark ? ["#0d0b10", "#121218"] : ["#8ec5ff", "#b9e0ff"]}
      style={styles.fill}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hCity}>{city}</Text>
            <Text style={styles.hSub}>Updated a moment ago</Text>
          </View>
          <Toggle value={isDark} onChange={setIsDark} />
        </View>

        <View style={{ marginTop: 12 }}>
          <SearchBar onSubmit={(q) => q && setCity(q)} />
        </View>
        
        <View style={{ marginTop: 14 }}>
          <CurrentWeatherCard city={city} current={current} />
        </View>

        <ForecastPills items={daily} />
        <HourlyChart items={hourly} />

        <View style={styles.grid}>
          <MetricTile
            label="Visibility"
            value={visibility}
            unit="mi"
            status={visibility === "-" ? "-" : visibility >= 30 ? "Excellent" : visibility >= 15 ? "Good" : visibility >= 8 ? "Moderate" : "Poor"}
            renderExtra={() => {
              const visibilityValue = parseFloat(visibility);
              if (visibility === "-") return null;

              return (
                <View style={{ alignItems: "center" }}>
                  {/* Excellent (30+ mi) - Show all 4 bars */}
                  {visibilityValue >= 30 && (
                    <>
                      <View style={[barStyle, { width: 30, backgroundColor: "#b8f5d3" }]} />
                      <View style={[barStyle, { width: 40, backgroundColor: "#6fddad" }]} />
                      <View style={[barStyle, { width: 50, backgroundColor: "#34d399" }]} />
                      <View style={[barStyle, { width: 60, backgroundColor: "#13d189" }]} />
                    </>
                  )}
                  
                  {/* Good (10-29.9 mi) - Show 3 bars */}
                  {visibilityValue >= 15 && visibilityValue < 30 && (
                    <>
                      <View style={[barStyle, { width: 40, backgroundColor: "#6fddad" }]} />
                      <View style={[barStyle, { width: 50, backgroundColor: "#34d399" }]} />
                      <View style={[barStyle, { width: 60, backgroundColor: "#13d189" }]} />
                    </>
                  )}
                  
                  {/* Moderate (5-9.9 mi) - Show 2 bars */}
                  {visibilityValue >= 8 && visibilityValue < 10 && (
                    <>
                      <View style={[barStyle, { width: 50, backgroundColor: "#34d399" }]} />
                      <View style={[barStyle, { width: 60, backgroundColor: "#13d189" }]} />
                    </>
                  )}
                  
                  {/* Poor (less than 5 mi) - Show 1 bar only */}
                  {visibilityValue < 5 && (
                    <View style={[barStyle, { width: 60, backgroundColor: "#13d189" }]} />
                  )}
                </View>
              );
            }}
          />
          <MetricTile label="Pressure" value={pressure} unit="hPa" />
        </View>

        <Text style={styles.footer}>{loading ? "Loading…" : "All data • OpenWeather"}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  container: { paddingTop: 54, paddingHorizontal: 16, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  hCity: { color: "#fff", fontSize: 26, fontWeight: "900" },
  hSub: { color: "#d0c6bf", opacity: 0.85, marginTop: 2 },
  grid: { flexDirection: "row", gap: 12, marginTop: 14 },
  footer: { color: "#a7a2a0", textAlign: "center", marginTop: 18 },
});
const barStyle = {
  height: 6,
  borderRadius: 4,
  marginVertical: 2,
};