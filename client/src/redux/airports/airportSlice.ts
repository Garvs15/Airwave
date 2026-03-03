import { createSlice } from "@reduxjs/toolkit";
import { getAllAirports } from "./airportAction";

export interface Airplane {
  id: number;
  name: string;
  city: string;
}

interface AirportState {
  airports: Airplane[];
  loading: boolean
}

const initialState: AirportState = {
  airports: [],
  loading: false
};

const airportSlice = createSlice({
  name: "airport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAirports.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllAirports.fulfilled, (state, action) => {
        state.airports = action.payload;
        state.loading = false
      })
      .addCase(getAllAirports.rejected, (state, action) => {
        state.loading = false
      });
  },
});

export default airportSlice.reducer;
