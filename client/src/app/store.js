import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postsReducer from "../features/posts/postsSlice";
import themeReducer from "../features/theme/themeSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    theme: themeReducer,
    notifications: notificationsReducer,
  },
});