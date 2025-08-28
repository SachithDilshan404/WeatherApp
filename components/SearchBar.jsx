import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ onSubmit }) {
  return (
    <BlurView intensity={25} tint="dark" style={styles.wrap}>
      <View style={styles.inner}>
        <Ionicons name="search" size={18} color="#cfd3d8" />
        <TextInput
          placeholder="Search city"
          placeholderTextColor="#aab1b8"
          returnKeyType="search"
          onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
          style={styles.input}
        />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 18, overflow: "hidden" },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: { flex: 1, color: "#fff", fontSize: 16 },
});
