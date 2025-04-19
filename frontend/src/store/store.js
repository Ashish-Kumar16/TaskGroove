import { configureStore } from "@reduxjs/toolkit";
import membersReducer from "./membersSlice";
import projectsReducer from "./projectsSlice";
import tasksReducer from "./tasksSlice";

export const store = configureStore({
  reducer: {
    members: membersReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
});
