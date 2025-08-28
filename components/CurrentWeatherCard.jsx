import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "./GlassCard";

export default function CurrentWeatherCard({ city, current }) {
  if (!current) return null;
  const icon = current.weather?.[0]?.icon ?? "01d";
  const condition = current.weather?.[0]?.main ?? "";
  const temp = Math.round(current.main?.temp ?? 0);
  const hi = Math.round(current.main?.temp_max ?? temp);
  const lo = Math.round(current.main?.temp_min ?? temp);

  return (
    <LinearGradient
      colors={["#2b1206", "#0b0b0d"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrap}
    >
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.updated}>Updated a moment ago</Text>

      <GlassCard style={{ marginTop: 18 }}>
        <View style={styles.rowTop}>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
            style={{ width: 68, height: 68 }}
          />
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={styles.temp}>{temp}°</Text>
            <Text style={styles.cond}> {condition}</Text>
          </View>
        </View>

        <View style={styles.rowHL}>
          <Text style={styles.hl}>H {hi}°</Text>
          <Text style={styles.hl}>L {lo}°</Text>
        </View>
      </GlassCard>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 26, padding: 18 },
  city: { color: "#fff", fontSize: 28, fontWeight: "800" },
  updated: { color: "#cbb", opacity: 0.8, marginTop: 2 },
  rowTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  temp: { color: "#fff", fontSize: 64, fontWeight: "900", lineHeight: 64 },
  cond: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 6 },
  rowHL: { flexDirection: "row", gap: 16, marginTop: 8 },
  hl: { color: "#e7e1dc", fontWeight: "700" },
});
