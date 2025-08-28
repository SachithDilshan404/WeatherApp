import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Toggle from "../components/Toggle";

export default function SettingsScreen() {
  const { isDark, setIsDark } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0b0b0d" : "#f7f7f8" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>Appearance</Text>
      <View style={{ marginTop: 10 }}>
        <Toggle label="Dark Mode" value={isDark} onChange={setIsDark} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 54, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: "900" },
});
