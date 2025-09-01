import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GlassCard from "./GlassCard";

export default function MetricTile({ label, value, unit, status, renderExtra }) {
  return (
    <GlassCard style={styles.wrap}>
      <View style={styles.content}>
        {/* Left Side: Text */}
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {value} <Text style={styles.unit}>{unit}</Text>
          </Text>
          {status && <Text style={styles.status}>{status}</Text>}
        </View>

        {/* Right Side: Extra Content (e.g. bars, icons, etc.) */}
        {renderExtra && <View style={styles.extra}>{renderExtra()}</View>}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  content: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: "#c9c6c3", fontWeight: "700" },
  value: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 6 },
  unit: { fontSize: 16, fontWeight: "700", opacity: 0.9 },
  status: { marginTop: 4, fontSize: 14, fontWeight: "600", color: "#9be29b" }, // green status
  extra: { marginLeft: 10 },
});
