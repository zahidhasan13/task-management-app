// src/screens/Home/HomeScreen.js
import { API_URL } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";
// import { fetchProjects } from "../../redux/features/projectSlice";
import { useNavigation } from "@react-navigation/native";
import { fetchTeams } from "../../redux/features/teamSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token, user } = useSelector((state) => state.auth);
  const { teams } = useSelector((state) => state.team);
  // const { projects } = useSelector((state) => state.project || { projects: [] });

  const userName = user?.name || "User";

  // Color palettes for team cards
  const teamColors = [
    { background: ["#FF9A8B", "#FF6B88", "#FF99AC"], text: "#fff" },
    { background: ["#667eea", "#764ba2", "#6B8DD6"], text: "#fff" },
    { background: ["#4FACFE", "#00F2FE", "#4FC3F7"], text: "#fff" },
    { background: ["#43E97B", "#38F9D7", "#4CD964"], text: "#fff" },
    { background: ["#FFED4E", "#FFA62E", "#FFD166"], text: "#333" },
    { background: ["#A78BFA", "#7E5BEF", "#8B5CF6"], text: "#fff" },
    { background: ["#FF6B6B", "#FF8E8E", "#FF5252"], text: "#fff" },
    { background: ["#00D2FF", "#3A7BD5", "#2979FF"], text: "#fff" },
  ];

  // Get random color for team card
  const getTeamColor = (index) => {
    return teamColors[index % teamColors.length];
  };

  // Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.user) {
          dispatch(setCredentials({ user: data.user, token: data.token }));
        }
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };

    fetchUser();
  }, [dispatch]);

  // Fetch Teams + Projects
  useEffect(() => {
    if (token) {
      dispatch(fetchTeams());
      // dispatch(fetchProjects()); // <-- Load Project Count
    }
  }, [token]);

  // Handle team press - navigate to TaskListScreen
  const handleTeamPress = (team) => {
    console.log(team._id,"team")
    navigation.navigate("TeamMember", { 
      teamId: team._id,
      teamName: team.name 
    });
  };

  // TEAM CARD UI - COLORFUL VERSION
  const renderTeamItem = ({ item, index }) => {
    const colors = getTeamColor(index);
    return (
      <TouchableOpacity
        onPress={() => handleTeamPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.background}
          style={styles.teamCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.teamHeader}>
            <Text style={[styles.teamName, { color: colors.text }]}>
              {item?.name}
            </Text>
            <View style={[styles.teamIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={[styles.teamIconText, { color: colors.text }]}>
                {item?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.teamDetails}>
            <View style={styles.detailRow}>
              <Text style={[styles.teamLabel, { color: colors.text }]}>👑 Captain:</Text>
              <Text style={[styles.teamValue, { color: colors.text }]}>
                {item?.captain?.name || "Unknown"}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.teamLabel, { color: colors.text }]}>👥 Members:</Text>
              <Text style={[styles.teamValue, { color: colors.text }]}>
                {item?.members?.length || 0}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName} 👋</Text>
          <Text style={styles.subtitle}>Welcome back to your workspace!</Text>
        </View>

        <View style={styles.avatarContainer}>
          <LinearGradient 
            colors={["#FF9A8B", "#FF6B88"]} 
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <LinearGradient 
          colors={["#4FACFE", "#00F2FE"]} 
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statNumber}>{teams?.length || 0}</Text>
          <Text style={styles.statLabel}>Total Teams</Text>
        </LinearGradient>

        <LinearGradient 
          colors={["#43E97B", "#38F9D7"]} 
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statNumber}>
            {/* {projects?.length || 0} */}0
          </Text>
          <Text style={styles.statLabel}>Total Projects</Text>
        </LinearGradient>
      </View>

      {/* Teams Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Teams</Text>
        <Text style={styles.sectionSubtitle}>
          {teams?.length || 0} active teams
        </Text>
      </View>

      <FlatList
        data={teams || []}
        keyExtractor={(item) => item?._id || Math.random().toString()}
        renderItem={renderTeamItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.teamList}
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
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },

  avatarContainer: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },

  // Teams Section
  sectionHeader: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  teamList: {
    paddingBottom: 20,
  },

  // Team Cards
  teamCard: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  teamName: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },

  teamIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  teamIconText: {
    fontSize: 14,
    fontWeight: "700",
  },

  teamDetails: {
    gap: 6,
  },

  detailRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
  },

  teamLabel: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.9,
  },

  teamValue: {
    fontSize: 13,
    fontWeight: "500",
  },
});