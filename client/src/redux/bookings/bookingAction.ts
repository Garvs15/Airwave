import { createAsyncThunk } from "@reduxjs/toolkit";
import booking from "../../api/services/booking";


export const bookings = createAsyncThunk(
  '/bookingsHistory',
  async (payload: any, thunkApi: any) => {
    const response = await booking.bookings({userId:payload.userId, page:payload.page}, payload.token);
    return {
      data: response.data.data.bookingDetails,
      page: response.data.data.pagination.currentPage,
      totalPages: response.data.data.pagination.totalPages,
      totalBookings: response.data.data.pagination.totalBookings,
    }
  }
)

export const getBookingById = createAsyncThunk(
  '/getBookingById',
  async (payload: any , thunkApi: any) => {
    const response = await booking.getBookingById({bookingId:payload.bookingId}, payload.token);
    return response.data.data
  }
)