// src/store/membersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../lib/api";

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async () => {
    return await api.fetchMembers();
  },
);

export const addMember = createAsyncThunk(
  "members/addMember",
  async (memberData) => {
    return await api.addMember(memberData);
  },
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, ...memberData }) => {
    const updatedMember = await api.updateMember(id, memberData);
    return updatedMember;
  },
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id) => {
    await api.deleteMember(id);
    return id;
  },
);

const membersSlice = createSlice({
  name: "members",
  initialState: { members: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (m) => m.id === action.payload.id,
        );
        if (index !== -1) state.members[index] = action.payload;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.id !== action.payload);
      });
  },
});

export default membersSlice.reducer;
