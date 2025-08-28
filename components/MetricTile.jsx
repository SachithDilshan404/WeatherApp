import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GlassCard from "./GlassCard";

export default function MetricTile({ label, value, unit }) {
  return (
    <GlassCard style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value} <Text style={styles.unit}>{unit}</Text>
      </Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  label: { color: "#c9c6c3", fontWeight: "700" },
  value: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 6 },
  unit: { fontSize: 16, fontWeight: "700", opacity: 0.9 },
});
