import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({
  title,
  onPress,
  disabled = false,
  backgroundColor = "#4CAF50",
  textColor = "#fff",
  style,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#a5a5a5" : backgroundColor },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
