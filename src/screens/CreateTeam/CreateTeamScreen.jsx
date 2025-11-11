// src/screens/Team/CreateTeamScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateTeamScreen({ navigation }) {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async () => {
    // Validation
    if (!teamName.trim()) {
      Alert.alert("Error", "Please enter a team name");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newTeam = {
        name: teamName,
        createdAt: new Date().toISOString(),
      };

      console.log("Team created:", newTeam);
      
      Alert.alert(
        "Success! 🎉",
        `Team "${teamName}" has been created successfully!`,
        [
          {
            text: "OK",
            onPress: () => {
              // navigation.goBack(); // Navigate back to home
              // Or reset form:
              setTeamName("");
            },
          },
        ]
      );
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Create New Team</Text>
        <Text style={styles.headerSubtitle}>
          Build your dream team with a unique identity
        </Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        {/* Team Name Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            Team Name <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Design Team"
              placeholderTextColor="#999"
              value={teamName}
              onChangeText={setTeamName}
              maxLength={50}
            />
          </View>
          <Text style={styles.charCount}>{teamName.length}/50</Text>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={handleCreateTeam}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ["#999", "#666"] : ["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createGradient}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? "Creating..." : "Create Team"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  inputSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  required: {
    color: "#f5576c",
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1a1a1a",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  createButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});