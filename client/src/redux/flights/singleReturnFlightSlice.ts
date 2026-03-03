import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Flight } from "./flightSlice";
import { getFlight, getReturnFlight } from "./flightsAction";

const initialState: Flight = {
  id: 0,
  flightNumber: '',
  flight: {modelNumber: '', capacity: 0},
  arrivalAirport: {name: '', city: ''},
  arrivalTime: '',
  departureAirport: {name: '', city: ''},
  departureTime: '',
  price: 0,
  nextDay: 0,
  flightTime: '',
  isInternational: false
}

const singleReturnFlight = createSlice({
  name: 'singleReturnFlight',
  initialState,
  reducers: {
    setSingleReturnFlight: (state: Flight, action: PayloadAction<Flight>) => {
      return action.payload;
    },
    resetSingleReturnFlight: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getReturnFlight.fulfilled, (state, action) => {
      return action.payload.data
    })
    builder.addCase(getReturnFlight.rejected, (state, action) => {
      // console.log("rejected");
    })
  }
})

export const {
  setSingleReturnFlight,
  resetSingleReturnFlight
} = singleReturnFlight.actions;

export default singleReturnFlight.reducer;