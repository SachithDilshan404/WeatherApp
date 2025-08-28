import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GlassCard from "./GlassCard";

// Try to import Victory components with error handling
let VictoryChart, VictoryLine, VictoryAxis;
try {
  const Victory = require("victory-native");
  VictoryChart = Victory.VictoryChart;
  VictoryLine = Victory.VictoryLine;
  VictoryAxis = Victory.VictoryAxis;
} catch (error) {
  console.warn("Victory components could not be loaded:", error);
}

export default function HourlyChart({ items = [] }) {
  if (!items.length) return null;
  
  const data = items.map((it, i) => ({
    x: new Date(it.dt_txt).getHours(),
    y: Math.round(it.main.temp),
  }));

  // If Victory components are not available, show a simple text list
  if (!VictoryChart || !VictoryLine || !VictoryAxis) {
    return (
      <GlassCard style={{ marginTop: 14 }}>
        <Text style={styles.title}>Next Hours</Text>
        <View style={styles.fallbackContainer}>
          {data.slice(0, 6).map((item, index) => (
            <View key={index} style={styles.hourItem}>
              <Text style={styles.hourText}>
                {item.x === 0 ? "12a" : item.x < 12 ? `${item.x}a` : `${item.x - 12 || 12}p`}
              </Text>
              <Text style={styles.tempText}>{item.y}°</Text>
            </View>
          ))}
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={{ marginTop: 14 }}>
      <Text style={styles.title}>Next Hours</Text>
      <VictoryChart 
        domainPadding={{ x: 15, y: 20 }} 
        height={220}
        padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#d9d9d9" },
            tickLabels: { fill: "#d9d9d9", fontSize: 10 },
            grid: { stroke: "transparent" },
          }}
          tickFormat={(h) => (h === 0 ? "12a" : h < 12 ? `${h}a` : `${h - 12 || 12}p`)}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#d9d9d9" },
            tickLabels: { fill: "#d9d9d9", fontSize: 10 },
            grid: { stroke: "rgba(255,255,255,0.08)" },
          }}
        />
        <VictoryLine
          data={data}
          interpolation="monotoneX"
          style={{ 
            data: { 
              stroke: "#fff",
              strokeWidth: 3 
            } 
          }}
        />
      </VictoryChart>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: { color: "#fff", fontWeight: "700", marginBottom: 6, fontSize: 16 },
  fallbackContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  hourItem: {
    alignItems: "center",
  },
  hourText: {
    color: "#d9d9d9",
    fontSize: 10,
    marginBottom: 4,
  },
  tempText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
