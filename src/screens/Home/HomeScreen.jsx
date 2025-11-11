// src/screens/Home/HomeScreen.js
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

// Demo data
const user = {
  name: "John Doe",
};

const teams = [
  { id: 1, name: "Design Team", description: "Handles all UI/UX design tasks", color: ["#667eea", "#764ba2"], icon: "🎨", members: 8 },
  { id: 2, name: "Development Team", description: "Frontend & backend developers", color: ["#f093fb", "#f5576c"], icon: "💻", members: 12 },
  { id: 3, name: "Marketing Team", description: "Marketing & social media campaigns", color: ["#4facfe", "#00f2fe"], icon: "📱", members: 6 },
  { id: 4, name: "QA Team", description: "Quality assurance & testing", color: ["#43e97b", "#38f9d7"], icon: "✅", members: 5 },
];

export default function HomeScreen() {
  const renderTeamItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <LinearGradient
        colors={item.color}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.teamCard}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamDesc}>{item.description}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>{item.members} members</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardShine} />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#f8f9fa", "#e9ecef"]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name} 👋</Text>
          <Text style={styles.subtitle}>Welcome back! Here are your teams</Text>
        </View>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>JD</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Teams</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>31</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
      </View>

      {/* Team List */}
      <Text style={styles.sectionTitle}>Your Teams</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTeamItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#6c757d",
    fontWeight: "500",
  },
  avatarContainer: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  teamCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 30,
  },
  teamInfo: {
    flex: 1,
    justifyContent: "center",
  },
  teamName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  teamDesc: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    lineHeight: 18,
  },
  memberBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  memberText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  cardShine: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 50,
    transform: [{ translateX: 30 }, { translateY: -30 }],
  },
});