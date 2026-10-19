import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/notifications");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const markAllRead = createAsyncThunk("notifications/readAll", async () => {
  await API.put("/notifications/read-all");
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [], unreadCount: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
      });
  },
});

export default notificationsSlice.reducer;