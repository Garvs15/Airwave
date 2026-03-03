import { createSlice } from "@reduxjs/toolkit"
import { bookings } from "./bookingAction";


interface Booking {
  bookings: [],
  page: number,
  totalPages: number,
  totalBookings: number
}

const initialState: Booking = {
  bookings: [],
  page: 1,
  totalPages: 1,
  totalBookings: 1
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    retsetBookings: (state, action) => {
      return initialState;
    },
    addPage: (state) => {
      state.page += 1;
    },
    resetPage: state => {
      state.page = 1
    }
  },
  extraReducers: (builder) => {
    builder.addCase(bookings.fulfilled, (state:any, action:any) => {
      if(action.payload.page === 1){
        state.bookings = action.payload.data
      }else {
        state.bookings = [...state.bookings, ...action.payload.data]
      }
      state.page = action.payload.page
      state.totalPages = action.payload.totalPages
      state.totalBookings = action.payload.totalBookings
    });
    builder.addCase(bookings.rejected, (state, action) => {
      // console.log("rejected");
    });
  }
})

export const {
  retsetBookings,
  addPage,
  resetPage
} = bookingSlice.actions;

export default bookingSlice.reducer;