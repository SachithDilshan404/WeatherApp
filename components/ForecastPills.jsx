import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import GlassCard from "./GlassCard";

export default function ForecastPills({ items = [] }) {
  if (!items.length) return null;
  return (
    <GlassCard style={{ marginTop: 14 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {items.map((d) => {
          const day = new Date(d.date).toLocaleDateString(undefined, { weekday: "short" });
          return (
            <View key={d.date} style={styles.pill}>
              <Text style={styles.day}>{day}</Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${d.icon}.png` }}
                style={{ width: 28, height: 28, marginVertical: 6 }}
              />
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
