import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../supabase";

interface ParamState {
  selectedBookingDate: string | null;
  clickedDashboardDate: string | null;
}

const initialState: ParamState = {
  selectedBookingDate: null,
  clickedDashboardDate: null,
};

const paramSlice = createSlice({
  name: "param",
  initialState,
  reducers: {
    setClickedDashboardDate: (state, action: PayloadAction<string | null>) => {
      state.clickedDashboardDate = action.payload;
    },
    setSelectedBookingDate: (state, action: PayloadAction<string | null>) => {
      state.selectedBookingDate = action.payload;
    },
  },
});

export const { setClickedDashboardDate, setSelectedBookingDate } = paramSlice.actions;
export default paramSlice.reducer;
