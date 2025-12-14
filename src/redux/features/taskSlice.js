// redux/features/taskSlice.js
import { API_URL } from "@env";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ✅ Fetch All Tasks for a Team
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (teamId, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const res = await fetch(`${API_URL}/task?teamId=${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("data", data);
      if (!res.ok) return rejectWithValue(data.message);
      return data.tasks;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Fetch Tasks by Member (backend automatically filters by user role and ID from token)
export const fetchTasksByMember = createAsyncThunk(
  "task/fetchTasksByMember",
  async ({ teamId }, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const res = await fetch(`${API_URL}/task?teamId=${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data.tasks;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Create Task
export const createTask = createAsyncThunk(
  "task/createTask",
  async (taskData, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      console.log("Creating task with data:", taskData);
      console.log("API_URL:", API_URL);
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "MISSING");

      if (!token) {
        return rejectWithValue(
          "Authentication token is missing. Please login again."
        );
      }

      const res = await fetch(`${API_URL}/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      console.log("Create task response status:", res.status);
      const data = await res.json();
      console.log("Create task response data:", data);

      if (!res.ok) {
        const errorMsg = data.message || data.error || "Failed to create task";
        return rejectWithValue(errorMsg);
      }
      return data.task;
    } catch (err) {
      console.error("Create task error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Update Task
export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ taskId, updates }, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      // Build query parameters from updates object
      const queryParams = new URLSearchParams();
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined && updates[key] !== null) {
          queryParams.append(key, updates[key]);
        }
      });

      const url = `${API_URL}/task/${taskId}?${queryParams.toString()}`;
      console.log("Update task URL:", url);

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Update task response:", data);

      if (!res.ok) {
        const errorMsg = data.message || data.error || "Failed to update task";
        return rejectWithValue(errorMsg);
      }

      return data.task;
    } catch (err) {
      console.log("Update task error:", err);
      return rejectWithValue(err.message || "Failed to update task");
    }
  }
);

// ✅ Delete Task
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const res = await fetch(`${API_URL}/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        return rejectWithValue(data.message || "Failed to delete task");
      return taskId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Slice
const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    selectedMemberTasks: [],
    selectedMember: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
    clearTaskSuccess: (state) => {
      state.success = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.selectedMemberTasks = [];
      state.selectedMember = null;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Tasks by Member
      .addCase(fetchTasksByMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByMember.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.selectedMemberTasks = action.payload;
      })
      .addCase(fetchTasksByMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.success = "Task created successfully";
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
        state.success = "Task updated successfully";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        state.success = "Task deleted successfully";
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedMember,
  clearTaskError,
  clearTaskSuccess,
  clearTasks,
} = taskSlice.actions;
export default taskSlice.reducer;
