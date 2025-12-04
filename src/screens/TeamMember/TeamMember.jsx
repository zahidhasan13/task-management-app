import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTeamMember, getSingleTeam } from "../../redux/features/teamSlice";

export default function TeamMemberListScreen({ navigation, route }) {
  const teamID = route?.params?.teamId;
  const dispatch = useDispatch();
  const { singleTeam, loading, error } = useSelector((state) => state.team);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (teamID) {
      dispatch(getSingleTeam(teamID));
    }
  }, [teamID, dispatch]);

  // Get all unique team members (captain + members, no duplicates)
  const getTeamMembers = () => {
    if (!singleTeam) return [];
    
    const allMembers = [];
    const uniqueEmails = new Set();
    
    // Add captain first if exists
    if (singleTeam.captain && singleTeam.captain.email) {
      const captain = {
        ...singleTeam.captain,
        isCaptain: true,
        id: singleTeam.captain._id || `captain-${Date.now()}`,
        role: "captain"
      };
      allMembers.push(captain);
      uniqueEmails.add(singleTeam.captain.email.toLowerCase());
    }
    
    // Add other members, skip if same as captain
    if (singleTeam.members && Array.isArray(singleTeam.members)) {
      singleTeam.members.forEach(member => {
        const memberEmail = member.email?.toLowerCase();
        
        // Skip if member is the same as captain (same email)
        if (memberEmail && uniqueEmails.has(memberEmail)) {
          console.log(`Skipping duplicate member: ${memberEmail}`);
          return;
        }
        
        const regularMember = {
          ...member,
          isCaptain: false,
          id: member._id || `member-${Date.now()}`,
          role: member.role || "member"
        };
        allMembers.push(regularMember);
        
        if (memberEmail) {
          uniqueEmails.add(memberEmail);
        }
      });
    }
    
    return allMembers;
  };

  const members = getTeamMembers();
  console.log("All team members (no duplicates):", members);
  console.log("Single team data:", singleTeam);
  
  // Current user is the captain if they exist
  const currentUser = singleTeam?.captain;

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Function to generate gradient colors based on name
  const getMemberGradient = (name, index) => {
    if (!name) return ["#667eea", "#764ba2"];
    
    // Predefined beautiful gradients
    const gradients = [
      ["#667eea", "#764ba2"], // Purple
      ["#f093fb", "#f5576c"], // Pink to Red
      ["#4facfe", "#00f2fe"], // Blue
      ["#43e97b", "#38f9d7"], // Green
      ["#ff9a9e", "#fecfef"], // Light Pink
      ["#a8edea", "#fed6e3"], // Pastel
      ["#f6d365", "#fda085"], // Orange
      ["#d4fc79", "#96e6a1"], // Light Green
    ];
    
    // Use index or generate from name hash
    if (index !== undefined) {
      return gradients[index % gradients.length];
    }
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const indexFromHash = Math.abs(hash) % gradients.length;
    return gradients[indexFromHash];
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (teamID) {
      dispatch(getSingleTeam(teamID)).finally(() => {
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  };

  const handleRemove = (id) => {
    Alert.alert("Remove Member", "Are you sure you want to remove this member?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          // Later replace with API call
          Alert.alert("Success", "Member removed successfully!");
        },
      },
    ]);
  };

  const handleAddMember = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEmailInput("");
    setIsAdding(false);
  };

  const handleSubmitAddMember = () => {
    if (!emailInput.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!singleTeam?._id) {
      Alert.alert("Error", "Team information not available");
      return;
    }

    setIsAdding(true);
    
    dispatch(addTeamMember({ teamId: singleTeam._id, email: emailInput.trim() }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "✅ Member added successfully!");
        handleCloseModal();
        // Refresh the team data
        dispatch(getSingleTeam(teamID));
      })
      .catch((err) => {
        Alert.alert("Error", err.message || "Failed to add member");
        setIsAdding(false);
      });
  };

  const handleMemberPress = (member) => {
    // Navigate to member detail screen
    Alert.alert(
      member?.name || "Unknown Member",
      `Role: ${member?.isCaptain ? "Team Captain" : "Team Member"}\nEmail: ${member?.email || "No email"}${member?.isCaptain ? '\n\n👑 Team Captain' : ''}`
    );
  };

  const renderMember = ({ item, index }) => {
    console.log("Rendering member:", item);
    const initials = getInitials(item?.name);
    const gradientColors = getMemberGradient(item?.name, index);
    
    return (
      <TouchableOpacity 
        style={styles.memberCard}
        activeOpacity={0.8}
        onPress={() => handleMemberPress(item)}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.memberGradient}
        >
          <View style={styles.memberContent}>
            <View style={styles.memberLeft}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.avatarGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.avatarText, { color: gradientColors[0] }]}>
                    {initials}
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.memberInfo}>
                <View style={styles.memberHeader}>
                  <Text style={styles.memberName} numberOfLines={1}>
                    {item?.name || "Unknown Member"}
                  </Text>
                  {item?.isCaptain && (
                    <View style={styles.captainBadge}>
                      <Ionicons name="crown" size={10} color="#FFD700" />
                      <Text style={styles.captainText}>Captain</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberRole} numberOfLines={1}>
                  {item?.isCaptain ? "Team Captain" : "Team Member"}
                </Text>
                <Text style={styles.memberEmail} numberOfLines={1}>
                  {item?.email || "No email provided"}
                </Text>
              </View>
            </View>

            {/* Only show remove button if current user is captain and member is not captain */}
            {currentUser && !item?.isCaptain && (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemove(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="person-remove-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading team members...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER WITH GRADIENT */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Team Members</Text>
          
          <TouchableOpacity 
            style={styles.addMemberButton} 
            onPress={handleAddMember}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="person-add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="people" size={20} color="#fff" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{members.length}</Text>
              <Text style={styles.statLabel}>Total Members</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,215,0,0.2)' }]}>
              <Ionicons name="shield-checkmark" size={18} color="#FFD700" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {members.filter(m => m.isCaptain).length}
              </Text>
              <Text style={styles.statLabel}>Captains</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* COLORFUL MEMBER LIST */}
      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={28} color="#dc2626" />
            <Text style={styles.errorText}>Failed to load team data</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            renderItem={renderMember}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <View style={styles.listHeaderRow}>
                  <View>
                    <Text style={styles.listTitle}>Team Members</Text>
                    <Text style={styles.listSubtitle}>
                      {members.length} member{members.length !== 1 ? 's' : ''} in your team
                    </Text>
                  </View>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.emptyGradient}
                >
                  <Ionicons name="people-outline" size={64} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.emptyText}>No team members yet</Text>
                  <Text style={styles.emptySubtext}>Start by adding your first team member</Text>
                  <TouchableOpacity 
                    style={styles.emptyButton}
                    onPress={handleAddMember}
                  >
                    <Ionicons name="person-add" size={20} color="#667eea" />
                    <Text style={styles.emptyButtonText}>Add Member</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            }
            ListFooterComponent={<View style={styles.footer} />}
          />
        )}
      </View>

      {/* ADD MEMBER MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoid}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.modalHeader}
                  >
                    <View style={styles.modalHeaderContent}>
                      <Text style={styles.modalTitle}>Add Team Member</Text>
                      <TouchableOpacity 
                        onPress={handleCloseModal}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.modalSubtitle}>
                      Enter email address
                    </Text>
                  </LinearGradient>

                  <View style={styles.modalBody}>
                    <View style={styles.inputContainer}>
                      <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter email address"
                        placeholderTextColor="#94a3b8"
                        value={emailInput}
                        onChangeText={setEmailInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        returnKeyType="send"
                        onSubmitEditing={handleSubmitAddMember}
                        autoFocus={true}
                      />
                    </View>

                    <View style={styles.modalButtons}>
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={handleCloseModal}
                        disabled={isAdding}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.submitButton, isAdding && styles.submitButtonDisabled]}
                        onPress={handleSubmitAddMember}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.submitButtonText}>Add Member</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    backgroundColor: '#f8fafc',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },

  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },

  addMemberButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerStats: {
    flexDirection: 'row',
    gap: 16,
  },

  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statInfo: {
    flex: 1,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  content: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
  },

  listHeader: {
    paddingVertical: 24,
  },

  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  listTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1e293b',
    marginBottom: 6,
  },

  listSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  listContent: { 
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  separator: { 
    height: 16 
  },

  memberCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  memberGradient: {
    borderRadius: 20,
    padding: 2,
  },

  memberContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },

  avatarContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },

  memberInfo: { 
    flex: 1,
    gap: 4,
  },

  memberHeader: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  memberName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b',
  },

  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },

  captainText: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: '#B8860B',
    letterSpacing: 0.3,
  },

  memberRole: { 
    fontSize: 14, 
    color: '#475569',
    fontWeight: '600',
  },

  memberEmail: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },

  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  errorText: {
    color: '#dc2626',
    marginTop: 12,
    marginBottom: 20,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    borderRadius: 24,
    overflow: 'hidden',
  },

  emptyGradient: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    borderRadius: 24,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  emptyButtonText: {
    color: '#667eea',
    fontWeight: '700',
    fontSize: 14,
  },

  footer: {
    height: 30,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  keyboardAvoid: {
    width: '100%',
  },

  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },

  modalHeader: {
    padding: 24,
  },

  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },

  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },

  modalBody: {
    padding: 24,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },

  submitButton: {
    backgroundColor: '#667eea',
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});