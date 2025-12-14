import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import taskReducer from "./features/taskSlice";
import teamReducer from "./features/teamSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    task: taskReducer,
  },
});

export default store;
