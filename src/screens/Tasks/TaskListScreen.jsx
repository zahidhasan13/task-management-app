// src/screens/Task/TaskListScreen.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  deleteTask,
  fetchTasks,
  fetchTasksByMember,
  setSelectedMember,
  updateTask,
} from "../../redux/features/taskSlice";
import { getSingleTeam } from "../../redux/features/teamSlice";

export default function TaskListScreen({ navigation, route }) {
  const { teamId, memberId, memberName, memberEmail } = route.params || {};

  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.task);
  const { singleTeam } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);

  const [selectedTask, setSelectedTask] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form state for adding task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskStatus, setTaskStatus] = useState("Pending");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState(memberId || "");

  const isCaptain = singleTeam?.captain?._id === user?._id;

  // Helper function to format status for display
  const formatStatus = (status) => {
    if (!status) return "Unknown";
    const statusMap = {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      over_due: "Over Due",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // Helper function to format priority for display
  const formatPriority = (priority) => {
    if (!priority) return "Medium";
    const priorityMap = {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };
    return priorityMap[priority.toLowerCase()] || priority;
  };

  console.log("TaskListScreen - isCaptain:", isCaptain);
  console.log("TaskListScreen - user:", user?._id);
  console.log("TaskListScreen - captain:", singleTeam?.captain?._id);

  useEffect(() => {
    if (teamId) {
      dispatch(getSingleTeam(teamId));

      if (memberId) {
        // Fetch tasks for specific member
        dispatch(setSelectedMember({ id: memberId, name: memberName }));
        dispatch(fetchTasksByMember({ teamId }));
      } else {
        // Fetch all tasks for team
        dispatch(fetchTasks(teamId));
      }
    }
  }, [teamId, memberId, dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    if (memberId) {
      dispatch(fetchTasksByMember({ teamId })).finally(() =>
        setRefreshing(false)
      );
    } else {
      dispatch(fetchTasks(teamId)).finally(() => setRefreshing(false));
    }
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setDetailModalVisible(true);
  };

  const handleAddTask = () => {
    setAddModalVisible(true);
    // Pre-select member if viewing member's tasks
    if (memberId) {
      setSelectedAssignee(memberId);
    }
  };

  const handleSubmitTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    if (!selectedAssignee) {
      Alert.alert("Error", "Please select a team member to assign");
      return;
    }

    const taskData = {
      title: taskTitle.trim(),
      description: taskDescription.trim() || "No description",
      priority: taskPriority.toLowerCase(),
      status: taskStatus.toLowerCase().replace(" ", "_"),
      assignedTo: selectedAssignee,
      createdBy: user?._id,
      team: teamId,
      dueDate: taskDueDate.trim() || new Date().toISOString().split("T")[0],
    };

    console.log("Submitting task:", taskData);

    dispatch(createTask(taskData))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Task created successfully!");
        handleCloseAddModal();
        handleRefresh();
      })
      .catch((err) => {
        console.error("Task creation error:", err);
        Alert.alert("Error", err || "Failed to create task");
      });
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("Medium");
    setTaskStatus("Pending");
    setTaskDueDate("");
    setSelectedAssignee(memberId || "");
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deleteTask(taskId))
            .unwrap()
            .then(() => {
              Alert.alert("Success", "Task deleted successfully");
              setDetailModalVisible(false);
              handleRefresh();
            })
            .catch((err) => {
              Alert.alert("Error", err || "Failed to delete task");
            });
        },
      },
    ]);
  };

  const handleUpdateStatus = (taskId, newStatus) => {
    // Convert frontend status to backend format (e.g., "In Progress" -> "in_progress")
    const formattedStatus = newStatus.toLowerCase().replace(" ", "_");
    console.log("Updating task status:", { taskId, formattedStatus });
    dispatch(updateTask({ taskId, updates: { status: formattedStatus } }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Task status updated!");
        handleRefresh();
      })
      .catch((err) => {
        Alert.alert("Error", err || "Failed to update task");
      });
  };

  const getStatusColor = (status) => {
    if (!status) return "#999";
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "completed":
        return "#43e97b";
      case "in_progress":
        return "#4facfe";
      case "pending":
        return "#f093fb";
      case "cancelled":
        return "#ff6b6b";
      case "over_due":
        return "#f5576c";
      default:
        return "#999";
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return "#f093fb";
    const normalizedPriority = priority.toLowerCase();
    switch (normalizedPriority) {
      case "high":
      case "critical":
        return "#f5576c";
      case "medium":
        return "#f093fb";
      case "low":
        return "#43e97b";
      default:
        return "#999";
    }
  };

  const getTeamMembers = () => {
    if (!singleTeam) return [];
    const members = [];

    if (singleTeam.captain) {
      members.push({
        _id: singleTeam.captain._id,
        name: singleTeam.captain.name,
        email: singleTeam.captain.email,
      });
    }

    if (singleTeam.members && Array.isArray(singleTeam.members)) {
      singleTeam.members.forEach((member) => {
        if (member._id !== singleTeam.captain?._id) {
          members.push(member);
        }
      });
    }

    return members;
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => handleTaskPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskLeft}>
          <Text style={styles.taskName} numberOfLines={2}>
            {item.title || item.name}
          </Text>
          <Text style={styles.assignedTo}>
            👤 {item.assignedTo?.name || item.assignedTo || "Unassigned"}
          </Text>
        </View>
        <View style={styles.taskRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {formatStatus(item.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.taskMeta}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) + "20" },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(item.priority) },
              ]}
            >
              {formatPriority(item.priority)}
            </Text>
          </View>
          {item.dueDate && (
            <Text style={styles.dueDate}>
              📅 {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          )}
        </View>

        {isCaptain && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTask(item._id)}
          >
            <Ionicons name="trash-outline" size={16} color="#f5576c" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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

          <Text style={styles.headerTitle}>Tasks</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTask}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {memberName && (
          <View style={styles.memberInfo}>
            <Ionicons
              name="person-circle"
              size={40}
              color="rgba(255,255,255,0.9)"
            />
            <View style={styles.memberDetails}>
              <Text style={styles.memberName}>{memberName}</Text>
              <Text style={styles.memberEmail}>{memberEmail}</Text>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks?.length || 0}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {tasks?.filter((t) => t.status === "completed").length || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {tasks?.filter((t) => t.status === "in_progress").length || 0}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Task List */}
      <View style={styles.listContainer}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
          renderItem={renderTaskItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No tasks yet</Text>
              {isCaptain && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={handleAddTask}
                >
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.emptyButtonGradient}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.emptyButtonText}>Add Task</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>

      {/* Task Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Task Details</Text>
                  <TouchableOpacity
                    onPress={() => setDetailModalVisible(false)}
                  >
                    <Ionicons name="close" size={28} color="#999" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.detailTitle}>
                    {selectedTask.title || selectedTask.name}
                  </Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            getStatusColor(selectedTask.status) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(selectedTask.status) },
                        ]}
                      >
                        {selectedTask.status}
                      </Text>
                    </View>
                  </View>

                  {isCaptain && (
                    <View style={styles.statusButtons}>
                      {["Pending", "In Progress", "Completed"].map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.statusButton,
                            selectedTask.status === status &&
                              styles.statusButtonActive,
                          ]}
                          onPress={() =>
                            handleUpdateStatus(selectedTask._id, status)
                          }
                        >
                          <Text
                            style={[
                              styles.statusButtonText,
                              selectedTask.status === status &&
                                styles.statusButtonTextActive,
                            ]}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Priority:</Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            getPriorityColor(selectedTask.priority) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(selectedTask.priority) },
                        ]}
                      >
                        {selectedTask.priority}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Assigned To:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTask.assignedTo?.name ||
                        selectedTask.assignedTo ||
                        "Unassigned"}
                    </Text>
                  </View>

                  {selectedTask.dueDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Due Date:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(selectedTask.dueDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}

                  {selectedTask.description && (
                    <View style={styles.descriptionSection}>
                      <Text style={styles.detailLabel}>Description:</Text>
                      <Text style={styles.description}>
                        {selectedTask.description}
                      </Text>
                    </View>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.closeModalGradient}
                  >
                    <Text style={styles.closeModalText}>Close</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={handleCloseAddModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Task</Text>
              <TouchableOpacity onPress={handleCloseAddModal}>
                <Ionicons name="close" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Task Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter task title"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter task description"
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Assign To *</Text>
                <View style={styles.pickerContainer}>
                  {getTeamMembers().map((member) => (
                    <TouchableOpacity
                      key={member._id}
                      style={[
                        styles.memberOption,
                        selectedAssignee === member._id &&
                          styles.memberOptionSelected,
                      ]}
                      onPress={() => setSelectedAssignee(member._id)}
                    >
                      <Text
                        style={[
                          styles.memberOptionText,
                          selectedAssignee === member._id &&
                            styles.memberOptionTextSelected,
                        ]}
                      >
                        {member.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority</Text>
                <View style={styles.buttonGroup}>
                  {["Low", "Medium", "High"].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.optionButton,
                        taskPriority === priority && styles.optionButtonActive,
                      ]}
                      onPress={() => setTaskPriority(priority)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          taskPriority === priority &&
                            styles.optionButtonTextActive,
                        ]}
                      >
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.buttonGroup}>
                  {["Pending", "In Progress", "Completed"].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.optionButton,
                        taskStatus === status && styles.optionButtonActive,
                      ]}
                      onPress={() => setTaskStatus(status)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          taskStatus === status &&
                            styles.optionButtonTextActive,
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Due Date (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={taskDueDate}
                  onChangeText={setTaskDueDate}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitTask}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>Create Task</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#667eea",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  memberDetails: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  memberEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  taskLeft: {
    flex: 1,
    marginRight: 12,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 13,
    color: "#6c757d",
  },
  taskRight: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  dueDate: {
    fontSize: 12,
    color: "#6c757d",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#f5576c20",
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    marginBottom: 20,
  },
  emptyButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  modalBody: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c757d",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    marginLeft: 100,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  statusButtonActive: {
    backgroundColor: "#667eea20",
  },
  statusButtonText: {
    fontSize: 11,
    color: "#999",
  },
  statusButtonTextActive: {
    color: "#667eea",
    fontWeight: "600",
  },
  descriptionSection: {
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: "#1a1a1a",
    lineHeight: 22,
    marginTop: 8,
  },
  closeModalButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  closeModalGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#1a1a1a",
    backgroundColor: "#f8f9fa",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  memberOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  memberOptionSelected: {
    backgroundColor: "#667eea20",
    borderColor: "#667eea",
  },
  memberOptionText: {
    fontSize: 14,
    color: "#666",
  },
  memberOptionTextSelected: {
    color: "#667eea",
    fontWeight: "600",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionButtonActive: {
    backgroundColor: "#667eea20",
    borderColor: "#667eea",
  },
  optionButtonText: {
    fontSize: 13,
    color: "#666",
  },
  optionButtonTextActive: {
    color: "#667eea",
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
