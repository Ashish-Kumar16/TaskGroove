import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [
    {
      id: 1,
      title: "Research competitors",
      description: "Analyze main competitors' websites and features",
      status: "Completed",
      priority: "High",
      dueDate: "2023-07-01",
      project: {
        id: 1,
        name: "Website Redesign",
      },
      assignee: {
        id: 1,
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      },
      completed: true,
    },
    // ... more tasks
  ],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
  },
});

export const { addTask, removeTask, updateTask, toggleTaskCompletion } =
  tasksSlice.actions;
export default tasksSlice.reducer;
