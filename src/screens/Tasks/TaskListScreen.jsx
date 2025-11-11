// src/screens/Task/TaskListScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Demo data
const teamData = {
  teamName: "Design Team",
  captainName: "John Doe",
  totalTasks: 8,
  assignedTasks: 5,
};

const currentUser = {
  id: 1,
  name: "John Doe", // Change this to test non-captain view
  isCaptain: true, // Set to false to test member view
};

const tasksData = [
  {
    id: 1,
    name: "Create landing page design",
    status: "In Progress",
    priority: "High",
    assignedTo: "Alice Johnson",
    dueDate: "2024-11-15",
    description: "Design a modern landing page with hero section, features, and CTA buttons",
  },
  {
    id: 2,
    name: "Update brand guidelines",
    status: "Pending",
    priority: "Medium",
    assignedTo: "Bob Smith",
    dueDate: "2024-11-20",
    description: "Revise brand guidelines document with new color palette and typography",
  },
  {
    id: 3,
    name: "Mobile app UI mockups",
    status: "Completed",
    priority: "High",
    assignedTo: "Carol White",
    dueDate: "2024-11-10",
    description: "Create high-fidelity mockups for iOS and Android applications",
  },
  {
    id: 4,
    name: "Icon set design",
    status: "In Progress",
    priority: "Low",
    assignedTo: "David Brown",
    dueDate: "2024-11-18",
    description: "Design a consistent icon set for the web application (30 icons)",
  },
  {
    id: 5,
    name: "User research presentation",
    status: "Pending",
    priority: "High",
    assignedTo: "John Doe",
    dueDate: "2024-11-12",
    description: "Compile user research findings and create presentation deck",
  },
];

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState(tasksData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleEdit = (taskId) => {
    console.log("Edit task:", taskId);
    Alert.alert("Edit Task", `Editing task ID: ${taskId}`);
    // navigation.navigate('EditTask', { taskId });
  };

  const handleDelete = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTasks(tasks.filter((task) => task.id !== taskId));
            Alert.alert("Success", "Task deleted successfully");
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#43e97b";
      case "In Progress":
        return "#4facfe";
      case "Pending":
        return "#f093fb";
      default:
        return "#999";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#f5576c";
      case "Medium":
        return "#f093fb";
      case "Low":
        return "#43e97b";
      default:
        return "#999";
    }
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => handleTaskPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskLeft}>
          <Text style={styles.taskName}>{item.name}</Text>
          <Text style={styles.assignedTo}>👤 {item.assignedTo}</Text>
        </View>
        <View style={styles.taskRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Text
              style={[styles.statusText, { color: getStatusColor(item.status) }]}
            >
              {item.status}
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
              {item.priority}
            </Text>
          </View>
          <Text style={styles.dueDate}>📅 {item.dueDate}</Text>
        </View>

        {currentUser.isCaptain && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item.id)}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.teamName}>{teamData.teamName}</Text>
        <Text style={styles.captain}>👑 Captain: {teamData.captainName}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{teamData.totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{teamData.assignedTasks}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Task List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks available</Text>
            </View>
          }
        />
      </View>

      {/* Task Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Task Details</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.detailTitle}>{selectedTask.name}</Text>

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
                      {selectedTask.assignedTo}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date:</Text>
                    <Text style={styles.detailValue}>{selectedTask.dueDate}</Text>
                  </View>

                  <View style={styles.descriptionSection}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.description}>
                      {selectedTask.description}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setModalVisible(false)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  teamName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  captain: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
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
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
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
    flexWrap: "wrap",
    gap: 8,
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
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#4facfe20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 12,
    color: "#4facfe",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#f5576c20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#f5576c",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
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
    maxHeight: "80%",
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
  closeButton: {
    fontSize: 28,
    color: "#999",
    fontWeight: "300",
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
});