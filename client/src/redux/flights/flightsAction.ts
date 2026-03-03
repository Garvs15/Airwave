import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";
import flights from "../../api/services/flights";

export const getFlightsData = createAsyncThunk(
  "/flights",
  async (
    data: {
      departureAirportId: number;
      arrivalAirportId: number;
      date: Dayjs;
      time: string;
      type: string;
      page: number;
      minPrice?: number;
      maxPrice?: number;
    },
    thunkApi: any
  ) => {
    try {
      const {
        departureAirportId,
        arrivalAirportId,
        date,
        time,
        type,
        page,
        minPrice,
        maxPrice,
      } = data;

      // 🔹 Log the parameters being sent
      console.log("Fetching flights with params:", {
        departureAirportId,
        arrivalAirportId,
        date: date.format("YYYY-MM-DD"),
        time,
        type,
        page,
        minPrice,
        maxPrice,
      });

      const response = await flights.getFlightsData({
        departureAirportId,
        arrivalAirportId,
        date,
        time,
        page,
        minPrice,
        maxPrice,
      });

     // 🔹 Log flights returned from API
      console.log("Flights API returned flights array:", response.data.data.flights);
      console.log("Full API response:", response.data);

      return {
        data: response.data.data.flights,
        type,
        page,
        totalPages: response.data.data.pagination.totalPages,
        totalFlights: response.data.data.pagination.totalFlights,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
);

export const getFlight = createAsyncThunk(
  "flight:id",
  async (id: string | number, thunkApi: any) => {
    try {
      // 🔹 Log the flight ID being fetched
      console.log("Fetching single flight with ID:", id);

      const response = await flights.getFlight(id);

      // 🔹 Log the response
      console.log("Single flight API response:", response.data.data);

      return {
        data: response.data.data,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
);

export const getReturnFlight = createAsyncThunk(
  "returnflight:id",
  async (id: string | number, thunkApi: any) => {
    try {
      // 🔹 Log the return flight ID
      console.log("Fetching return flight with ID:", id);

      const response = await flights.getFlight(id);

      // 🔹 Log the response
      console.log("Return flight API response:", response.data.data);

      return {
        data: response.data.data,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
);
