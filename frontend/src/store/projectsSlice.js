import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [
    {
      id: 1,
      name: "Website Redesign",
      description: "Redesign the company website with new branding",
      status: "In Progress",
      progress: 65,
      dueDate: "2023-07-15",
      members: [],
    },
    // ... more projects
  ],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload,
      );
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id,
      );
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    addMemberToProject: (state, action) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId,
      );
      if (
        project &&
        !project.members.some((m) => m.id === action.payload.member.id)
      ) {
        project.members.push(action.payload.member);
      }
    },
    removeMemberFromProject: (state, action) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId,
      );
      if (project) {
        project.members = project.members.filter(
          (m) => m.id !== action.payload.memberId,
        );
      }
    },
  },
});

export const {
  addProject,
  removeProject,
  updateProject,
  addMemberToProject,
  removeMemberFromProject,
} = projectsSlice.actions;
export default projectsSlice.reducer;
