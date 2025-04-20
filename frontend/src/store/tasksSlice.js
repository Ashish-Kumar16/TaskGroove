// src/store/tasksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../lib/api";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return await api.fetchTasks();
});

export const fetchAssignedTasks = createAsyncThunk(
  "tasks/fetchAssignedTasks",
  async () => {
    return await api.fetchAssignedTasks();
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData) => {
    return await api.createTask(taskData);
  },
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, ...taskData }) => {
    const updatedTask = await api.updateTask(id, taskData);
    return updatedTask;
  },
);
export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchTasksByProject",
  async (projectId) => {
    const tasks = await api.fetchTasksByProject(projectId);
    return tasks.map((task) => ({
      ...task,
      id: task._id,
    }));
  },
);
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId) => {
    await api.deleteTask(taskId);
    return taskId;
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id, // Changed to _id
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;
