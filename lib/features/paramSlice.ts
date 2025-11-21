import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../supabase";

interface ParamState {
  clickedDashboardDate: string | null;
}

const initialState: ParamState = {
  clickedDashboardDate: null,
};

const paramSlice = createSlice({
  name: "param",
  initialState,
  reducers: {
    setClickedDashboardDate: (state, action: PayloadAction<string | null>) => {
      state.clickedDashboardDate = action.payload;
    },
  },
});

export const { setClickedDashboardDate } = paramSlice.actions;
export default paramSlice.reducer;
