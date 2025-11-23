import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getSingleTeam } from "../../redux/features/teamSlice";

export default function TeamMemberListScreen({ navigation, route }) {
  const teamID = route?.params?.teamId;
  const dispatch = useDispatch();
  const { singleTeam, loading, error } = useSelector((state) => state.team);

  useEffect(() => {
    if (teamID) {
      dispatch(getSingleTeam(teamID));
    }
  }, [teamID, dispatch]);

  // Demo fallback
  const fallbackMembers = [
    {
      id: 1,
      name: "John Doe",
      role: "Team Captain",
      isCaptain: true,
    },
    {
      id: 2,
      name: "Alice Johnson",
      role: "UI/UX Designer",
    },
    {
      id: 3,
      name: "Bob Smith",
      role: "Frontend Developer",
    },
    {
      id: 4,
      name: "Carol White",
      role: "Product Researcher",
    },
  ];

  // If API returns team members, use them; otherwise use fallback
  const members = singleTeam?.members || fallbackMembers;
  const currentUser = singleTeam?.captain || { id: 1, name: "John Doe", isCaptain: true };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Function to generate background color based on name
  const getAvatarColor = (name) => {
    if (!name) return "#667eea";
    
    const colors = [
      "#667eea", "#764ba2", "#f093fb", "#f5576c", 
      "#4facfe", "#00f2fe", "#43e97b", "#38f9d7",
      "#ffecd2", "#fcb69f", "#a8edea", "#fed6e3",
      "#ff9a9e", "#fecfef", "#f6d365", "#fda085"
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleRemove = (id) => {
    Alert.alert("Remove Member", "Are you sure you want to remove this member?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          // Later replace with API call
        },
      },
    ]);
  };

  const handleAddMember = () => {
    // Navigate to add member screen or show modal
    Alert.alert("Add Member", "Feature coming soon!");
  };

  const renderMember = ({ item }) => {
    const initials = getInitials(item.name);
    const backgroundColor = getAvatarColor(item.name);
    
    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={[styles.avatarContainer, { backgroundColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.memberInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              {item.isCaptain && (
                <View style={styles.captainBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#FFD700" />
                  <Text style={styles.captainText}>Captain</Text>
                </View>
              )}
            </View>
            <Text style={styles.role} numberOfLines={1}>{item.role}</Text>
          </View>
        </View>

        {currentUser?.isCaptain && !item?.isCaptain && (
          <TouchableOpacity 
            style={styles.removeBtn} 
            onPress={() => handleRemove(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="person-remove-outline" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading team members...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ENHANCED HEADER */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Team Members</Text>
            <Text style={styles.subtitle}>
              {members.length} {members.length === 1 ? 'member' : 'members'} in your team
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddMember}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="person-add-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* IMPROVED CONTENT */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Team Members</Text>
            <Text style={styles.sectionSubtitle}>Manage your team members</Text>
          </View>
          <View style={styles.stats}>
            <Text style={styles.statText}>{members.length} total</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={24} color="#dc2626" />
            <Text style={styles.errorText}>Failed to load team data</Text>
          </View>
        )}

        <FlatList
          data={members}
          keyExtractor={(item) => item?.id?.toString() || item?._id?.toString() || Math.random().toString()}
          renderItem={renderMember}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>No team members found</Text>
              <Text style={styles.emptySubtext}>Add members to get started</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8fafc" 
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b'
  },

  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },

  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },

  content: { 
    flex: 1, 
    paddingHorizontal: 24, 
    paddingTop: 24 
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  sectionTitle: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: "#1e293b",
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },

  stats: {
    backgroundColor: "rgba(100,116,139,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },

  statText: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#475569" 
  },

  listContent: { 
    paddingBottom: 30,
    flexGrow: 1,
  },

  separator: { 
    height: 12 
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },

  left: { 
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1 
  },

  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  memberInfo: { 
    marginLeft: 16, 
    flex: 1 
  },

  nameRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 6,
    flexWrap: 'wrap'
  },

  name: { 
    fontSize: 17, 
    fontWeight: "700", 
    color: "#1e293b", 
    marginRight: 8,
    flexShrink: 1
  },

  captainBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },

  captainText: { 
    fontSize: 11, 
    fontWeight: "700", 
    color: "#B8860B" 
  },

  role: { 
    fontSize: 14, 
    color: "#64748b",
    fontWeight: "500",
  },

  removeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,107,107,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.2)",
  },

  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626'
  },

  errorText: {
    color: '#dc2626',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});