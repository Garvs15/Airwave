import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import airport from "../../api/services/airport";
import flights from "../../api/services/flights";

export const getAirportId = createAsyncThunk(
  "/airports",
  async (
    data: { city: string },
    thunkApi: any
  ) => {
    try {
      const response = await flights.getAirportData(data);
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
);

export const getAllAirports = createAsyncThunk(
  "/getAllAirports",
  async (
    _, thunkApi
  ) => {
    try {
      const response = await airport.getAllAirports();
      return response.data.data
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)