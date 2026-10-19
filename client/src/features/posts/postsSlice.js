import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

const errMsg = (err, fallback) => err.response?.data?.message || fallback;

export const fetchPosts = createAsyncThunk(
  "posts/fetch",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await API.get(`/posts?page=${page}`);
      return { ...res.data, page };
    } catch (err) {
      return rejectWithValue(errMsg(err, "Failed to load posts"));
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (text, { rejectWithValue }) => {
    try {
      const res = await API.post("/posts", { text });
      return res.data;
    } catch (err) {
      return rejectWithValue(errMsg(err, "Failed to create post"));
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/posts/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(errMsg(err, "Failed to delete post"));
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/like",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.put(`/posts/${id}/like`);
      return res.data;
    } catch (err) {
      return rejectWithValue(errMsg(err, "Failed to like"));
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/comment",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/posts/${id}/comments`, { text });
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(errMsg(err, "Failed to comment"));
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: { items: [], page: 1, hasMore: true, loading: false, error: null },
  reducers: {
    // optimistic like: update the UI immediately
    optimisticLike: (state, action) => {
      const { id, userId } = action.payload;
      const post = state.items.find((p) => p._id === id);
      if (!post) return;
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((u) => u !== userId);
      } else {
        post.likes.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, hasMore, page } = action.payload;
        state.items = page === 1 ? posts : [...state.items, ...posts];
        state.page = page;
        state.hasMore = hasMore;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload._id);
        if (post) post.likes = action.payload.likes;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload.id);
        if (post) post.commentsCount = action.payload.commentsCount;
      });
  },
});

export const { optimisticLike } = postsSlice.actions;
export default postsSlice.reducer;