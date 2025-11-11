// src/screens/Profile/ProfileScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

// Demo user data
const user = {
  name: "John Doe",
  email: "john.doe@company.com",
  role: "Product Manager",
  department: "Engineering",
  joinDate: "January 2023",
  teams: 4,
  projects: 12,
};

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Add your logout logic here
            console.log("User logged out");
            // navigation.navigate('Login'); // Navigate to login screen
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
    // navigation.navigate('EditProfile');
  };

  const handleChangePassword = () => {
    console.log("Change password pressed");
    // navigation.navigate('ChangePassword');
  };

  const handleNotifications = () => {
    console.log("Notifications settings pressed");
    // navigation.navigate('Notifications');
  };

  const handlePrivacy = () => {
    console.log("Privacy settings pressed");
    // navigation.navigate('Privacy');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Avatar */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#f093fb", "#f5576c"]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>JD</Text>
          </LinearGradient>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.teams}</Text>
          <Text style={styles.statLabel}>Teams</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.projects}</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2+</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Role" value={user.role} />
          <InfoRow label="Department" value={user.department} />
          <InfoRow label="Joined" value={user.joinDate} />
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <SettingItem 
            icon="🔔" 
            title="Notifications" 
            onPress={handleNotifications}
          />
          <SettingItem 
            icon="🔒" 
            title="Privacy & Security" 
            onPress={handlePrivacy}
          />
          <SettingItem 
            icon="🔑" 
            title="Change Password" 
            onPress={handleChangePassword}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#f5576c", "#f093fb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoutGradient}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Helper Components
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const SettingItem = ({ icon, title, onPress }) => (
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingLeft}>
      <View style={styles.settingIconContainer}>
        <Text style={styles.settingIcon}>{icon}</Text>
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    <Text style={styles.settingArrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  userName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -30,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  settingArrow: {
    fontSize: 24,
    color: "#c0c0c0",
    fontWeight: "300",
  },
  logoutButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#f5576c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logoutGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});