import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import GlassCard from "./GlassCard";
import Svg, { Polyline, Line, Text as SvgText, Circle } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

export default function HourlyChart({ items = [] }) {
  if (!items.length) return null;
  
  // Prepare data for the chart - limit to 8 hours for better readability
  const data = items.slice(0, 8).map((item, index) => {
    const date = new Date(item.dt_txt);
    const hour = date.getHours();
    return {
      x: index + 1,
      y: Math.round(item.main.temp),
      label: hour === 0 ? "12a" : hour < 12 ? `${hour}a` : `${hour - 12 || 12}p`
    };
  });

  // Chart dimensions
  const chartWidth = screenWidth - 80;
  const chartHeight = 160;
  const padding = { top: 20, bottom: 40, left: 40, right: 20 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Calculate min and max values
  const minTemp = Math.min(...data.map(d => d.y)) - 2;
  const maxTemp = Math.max(...data.map(d => d.y)) + 2;
  const tempRange = maxTemp - minTemp;

  // Convert data to SVG coordinates
  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * plotWidth;
    const y = padding.top + plotHeight - ((d.y - minTemp) / tempRange) * plotHeight;
    return { x, y, temp: d.y, label: d.label };
  });

  // Create polyline points string
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <GlassCard style={{ marginTop: 14 }}>
      <Text style={styles.title}>Next Hours</Text>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding.top + ratio * plotHeight;
            return (
              <Line
                key={`grid-${index}`}
                x1={padding.left}
                y1={y}
                x2={padding.left + plotWidth}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            );
          })}
          
          {/* Temperature line */}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke="#4FC3F7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <React.Fragment key={`point-${index}`}>
              <Circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#4FC3F7"
              />
              {/* Temperature labels */}
              <SvgText
                x={point.x}
                y={point.y - 10}
                fill="#fff"
                fontSize="10"
                textAnchor="middle"
                fontWeight="600"
              >
                {point.temp}°
              </SvgText>
              {/* Time labels */}
              <SvgText
                x={point.x}
                y={chartHeight - 5}
                fill="#d9d9d9"
                fontSize="10"
                textAnchor="middle"
              >
                {point.label}
              </SvgText>
            </React.Fragment>
          ))}
          
          {/* Y-axis temperature labels */}
          {[minTemp, Math.round((minTemp + maxTemp) / 2), maxTemp].map((temp, index) => {
            const y = padding.top + plotHeight - ((temp - minTemp) / tempRange) * plotHeight;
            return (
              <SvgText
                key={`y-label-${index}`}
                x={padding.left - 10}
                y={y + 3}
                fill="#d9d9d9"
                fontSize="10"
                textAnchor="end"
              >
                {Math.round(temp)}°
              </SvgText>
            );
          })}
        </Svg>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: { 
    color: "#fff", 
    fontWeight: "700", 
    marginBottom: 16, 
    fontSize: 16 
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
