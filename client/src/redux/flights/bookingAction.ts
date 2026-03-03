import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import booking from "../../api/services/booking";


export const bookFlight = createAsyncThunk(
  '/bookings',
  async (payload: any, thunkApi: any) => {
    try {
      const token = payload.token;
      const { token: _, ...restPayload } = payload;
      const response = await booking.bookFlight(restPayload, token);
      return {
        data: response.data.data
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)