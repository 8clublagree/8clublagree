import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import paramReducer from "./features/paramSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    param: paramReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
