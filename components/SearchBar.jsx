import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ onSubmit, error, suggestions = [], onSuggestionSelect, onClearError, disabled = false, offlineMessage }) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (text) => {
    if (disabled) return;
    if (text.trim()) {
      onSubmit?.(text.trim());
      setInputValue("");
    }
  };

  const handleSuggestionPress = (suggestion) => {
    if (disabled) return;
    setInputValue("");
    onSuggestionSelect?.(suggestion);
    onClearError?.();
  };

  const handleInputChange = (text) => {
    if (disabled) return;
    setInputValue(text);
    // Clear error when user starts typing again
    if (error && text.length > 0) {
      onClearError?.();
    }
  };

  return (
    <View>
      <BlurView intensity={25} tint="dark" style={[styles.wrap, disabled && styles.wrapDisabled]}>
        <View style={styles.inner}>
          <Ionicons name="search" size={18} color={disabled ? "#666" : "#cfd3d8"} />
          <TextInput
            placeholder={disabled ? "Search disabled in offline mode" : "Search city"}
            placeholderTextColor={disabled ? "#666" : "#aab1b8"}
            returnKeyType="search"
            value={inputValue}
            onChangeText={handleInputChange}
            onSubmitEditing={(e) => handleSubmit(e.nativeEvent.text)}
            onFocus={() => !disabled && setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[styles.input, error && styles.inputError, disabled && styles.inputDisabled]}
            editable={!disabled}
            selectTextOnFocus={!disabled}
          />
          {error && (
            <TouchableOpacity onPress={onClearError} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#ff6b6b" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>

      {/* Offline Message */}
      {disabled && offlineMessage && (
        <View style={styles.offlineContainer}>
          <BlurView intensity={20} tint="dark" style={styles.offlineWrap}>
            <View style={styles.offlineInner}>
              <Ionicons name="wifi-outline" size={16} color="#fbbf24" />
              <Text style={styles.offlineText}>{offlineMessage}</Text>
            </View>
          </BlurView>
        </View>
      )}

      {/* Error Message */}
      {error && !disabled && (
        <View style={styles.errorContainer}>
          <BlurView intensity={20} tint="dark" style={styles.errorWrap}>
            <View style={styles.errorInner}>
              <Ionicons name="warning" size={16} color="#ff6b6b" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </BlurView>
        </View>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && !disabled && (
        <View style={styles.suggestionsContainer}>
          <BlurView intensity={20} tint="dark" style={styles.suggestionsWrap}>
            <View style={styles.suggestionsInner}>
              <Text style={styles.suggestionsTitle}>Did you mean:</Text>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Ionicons name="location" size={14} color="#34d399" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </BlurView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 18, overflow: "hidden" },
  wrapDisabled: { opacity: 0.6 },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: { flex: 1, color: "#fff", fontSize: 16 },
  inputError: { 
    borderBottomWidth: 1, 
    borderBottomColor: "#ff6b6b" 
  },
  inputDisabled: {
    color: "#666",
  },
  clearButton: {
    padding: 4,
  },
  
  // Offline message styles
  offlineContainer: {
    marginTop: 8,
  },
  offlineWrap: {
    borderRadius: 12,
    overflow: "hidden",
  },
  offlineInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  offlineText: {
    color: "#fbbf24",
    fontSize: 14,
    flex: 1,
  },
  
  // Error styles
  errorContainer: {
    marginTop: 8,
  },
  errorWrap: {
    borderRadius: 12,
    overflow: "hidden",
  },
  errorInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    flex: 1,
  },
  
  // Suggestions styles
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsWrap: {
    borderRadius: 12,
    overflow: "hidden",
  },
  suggestionsInner: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionsTitle: {
    color: "#aab1b8",
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    gap: 8,
  },
  suggestionText: {
    color: "#fff",
    fontSize: 14,
  },
});
