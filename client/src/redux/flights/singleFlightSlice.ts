import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Flight } from "./flightSlice";
import { getFlight } from "./flightsAction";

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

const singleFlightSlice = createSlice({
  name: 'singleFlight',
  initialState,
  reducers: {
    setSingleFlight: (state: Flight, action: PayloadAction<Flight>) => {
      return action.payload;
    },
    resetSingleFlight: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFlight.fulfilled, (state, action) => {
      return action.payload.data
    })
    builder.addCase(getFlight.rejected, (state, action) => {
      // console.log("rejected");
    })
  }
})

export const {
  setSingleFlight,
  resetSingleFlight
} = singleFlightSlice.actions;

export default singleFlightSlice.reducer;