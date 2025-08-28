import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import useWeather from "../hooks/useWeather";
import ForecastPills from "../components/ForecastPills";
import HourlyChart from "../components/HourlyChart";

export default function ForecastScreen() {
  const { isDark } = useTheme();
  const { city, daily, hourly } = useWeather();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0b0b0d" : "#eaf4ff" }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 54 }}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>Forecast • {city}</Text>
        <ForecastPills items={daily} />
        <HourlyChart items={hourly} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 8 },
});
