import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { getAirportId, getAllAirports } from "./airports/airportAction";
import { getFlight, getFlightsData, getReturnFlight } from "./flights/flightsAction";
import { changePassword, getUser, login, sendOtp, signUp, updateUser, validateEmail, verifyOtp } from "./user/userAction";
import { bookFlight } from "./flights/bookingAction";
import { bookings, getBookingById } from "./bookings/bookingAction";

interface LoadingState {
  loading: boolean;
}

const initialState: LoadingState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(getAirportId, getAllAirports, getFlight, getReturnFlight, getFlightsData, login, signUp, updateUser, verifyOtp, sendOtp, getUser, bookFlight, bookings, getBookingById, validateEmail, changePassword), (state) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(getAirportId, getAllAirports, getFlight, getReturnFlight, getFlightsData, login, signUp, updateUser, verifyOtp, sendOtp, getUser, bookFlight, bookings, getBookingById, validateEmail, changePassword), (state) => {
        state.loading = false;
      })
      .addMatcher(isRejected(getAirportId, getAllAirports, getFlight, getReturnFlight, getFlightsData, login, signUp, updateUser, verifyOtp, sendOtp, getUser, bookFlight, bookings, getBookingById, validateEmail, changePassword), (state) => {
        state.loading = false;
      });
  },
});

export const {
  setLoading
} = loadingSlice.actions

const loadingReducer = loadingSlice.reducer

export default loadingReducer;
