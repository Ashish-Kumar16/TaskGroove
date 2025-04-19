import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  members: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      role: "Project Manager",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 234-5678",
      role: "Frontend Developer",
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
    },
    // ... more members
  ],
  loading: false,
  error: null,
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMember: (state, action) => {
      state.members.push(action.payload);
    },
    removeMember: (state, action) => {
      state.members = state.members.filter(
        (member) => member.id !== action.payload,
      );
    },
    updateMember: (state, action) => {
      const index = state.members.findIndex(
        (member) => member.id === action.payload.id,
      );
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    },
  },
});

export const { addMember, removeMember, updateMember } = membersSlice.actions;
export default membersSlice.reducer;
