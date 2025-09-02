import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Toggle from "../components/Toggle";
import { OfflineStorageManager } from "../utils/offlineStorage";
import useWeather from "../hooks/useWeather";

export default function SettingsScreen() {
  const { isDark, setIsDark } = useTheme();
  const { isOnline, isOfflineMode, lastUpdated } = useWeather();
  const [clearing, setClearing] = useState(false);

  const handleClearOfflineData = async () => {
    Alert.alert(
      "Clear Offline Data",
      "Are you sure you want to clear all offline weather data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setClearing(true);
            try {
              await OfflineStorageManager.clearOfflineData();
              Alert.alert("Success", "Offline data has been cleared successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear offline data. Please try again.");
            } finally {
              setClearing(false);
            }
          }
        }
      ]
    );
  };

  const getConnectionStatus = () => {
    if (isOfflineMode) {
      return "Offline - Using cached data";
    } else if (isOnline) {
      return "Online - Live data";
    } else {
      return "Checking connection...";
    }
  };

  const getLastUpdateText = () => {
    if (lastUpdated) {
      return OfflineStorageManager.formatLastUpdated(lastUpdated);
    }
    return "No data cached";
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0b0b0d" : "#f7f7f8" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>Appearance</Text>
      <View style={{ marginTop: 10 }}>
        <Toggle label="Dark Mode" value={isDark} onChange={setIsDark} />
      </View>

      <Text style={[styles.title, { color: isDark ? "#fff" : "#111", marginTop: 40 }]}>
        Connection & Data
      </Text>
      
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#555" }]}>
            Connection Status:
          </Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: isOnline ? "#059669" : "#dc2626" 
          }]}>
            <Text style={styles.statusText}>{getConnectionStatus()}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#555" }]}>
            Last Data Update:
          </Text>
          <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#111" }]}>
            {getLastUpdateText()}
          </Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.clearButton, { 
            backgroundColor: isDark ? "#991b1b" : "#dc2626",
            opacity: clearing ? 0.6 : 1 
          }]}
          onPress={handleClearOfflineData}
          disabled={clearing}
        >
          <Text style={styles.clearButtonText}>
            {clearing ? "Clearing..." : "Clear Offline Data"}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.clearDescription, { color: isDark ? "#999" : "#666" }]}>
          This will remove all cached weather data from your device.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 54, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: "900" },
  infoSection: {
    marginTop: 16,
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  actionSection: {
    marginTop: 40,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clearDescription: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },
});
