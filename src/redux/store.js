import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import teamReducer from "./features/teamSlice";
// import taskReducer from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    // task: taskReducer,
  },
});

export default store;