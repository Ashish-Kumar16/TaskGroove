// src/store/projectsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../lib/api";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    return await api.fetchProjects();
  },
);

export const fetchUserProjects = createAsyncThunk(
  "projects/fetchUserProjects",
  async () => {
    return await api.fetchUserProjects();
  },
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData) => {
    return await api.createProject(projectData);
  },
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId) => {
    await api.deleteProject(projectId);
    return projectId;
  },
);
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId) => {
    const project = await api.fetchProjectById(projectId);
    return {
      ...project,
      id: project._id,
      team: project.members.map((member) => ({
        id: member._id,
        name: member.name,
        avatar: member.avatar,
        role: member.role,
      })),
    };
  },
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, projectData }) => {
    const updatedProject = await api.updateProject(projectId, projectData);
    return {
      ...updatedProject,
      id: updatedProject._id,
      team: updatedProject.members.map((member) => ({
        id: member._id,
        name: member.name,
        avatar: member.avatar,
        role: member.role,
      })),
    };
  },
);
const projectsSlice = createSlice({
  name: "projects",
  initialState: { projects: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload,
        );
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) state.projects[index] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      });
  },
});

export default projectsSlice.reducer;
