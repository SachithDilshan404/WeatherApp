import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function Toggle({ label = "Dark Mode", value, onChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  label: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
