import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import GlassCard from "./GlassCard";

export default function ForecastPills({ items = [] }) {
  // Weather emoji mapping
  const getWeatherEmoji = (iconCode) => {
    const emojiMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return emojiMap[iconCode] || '🌤️';
  };

  if (!items.length) return null;
  return (
    <GlassCard style={{ marginTop: 14 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {items.map((d) => {
          const day = new Date(d.date).toLocaleDateString(undefined, { weekday: "short" });
          return (
            <View key={d.date} style={styles.pill}>
              <Text style={styles.day}>{day}</Text>
              <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 6 }}>
                {getWeatherEmoji(d.icon)}
              </Text>
              <Text style={styles.temp}>{Math.round(d.temp)}°</Text>
            </View>
          );
        })}
      </ScrollView>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  pill: {
    minWidth: 72,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },
  day: { color: "#fff", fontWeight: "700" },
  temp: { color: "#fff", fontWeight: "700", marginTop: 2 },
});
