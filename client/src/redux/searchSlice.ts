import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

interface SearchState {
  departureCity: string;
  arrivalCity: string;
  departureDate: Dayjs;
  returnDate: Dayjs | null;
  passenger: number;
}

const initialState: SearchState = {
  departureCity: '',
  arrivalCity: '',
  departureDate: dayjs(new Date()),
  returnDate: null,
  passenger: 1,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDepartureCity: (state, action: PayloadAction<string>) => {
      state.departureCity = action.payload;
    },
    setArrivalCity: (state, action: PayloadAction<string>) => {
      state.arrivalCity = action.payload;
    },
    setDepartureDate: (state, action: PayloadAction<Dayjs>) => {
      state.departureDate = action.payload;
    },
    setReturnDate: (state, action: PayloadAction<Dayjs | null>) => {
      state.returnDate = action.payload;
    },
    setPassenger: (state, action: PayloadAction<number>) => {
      state.passenger = action.payload;
    },
  },
});

export const {
  setDepartureCity,
  setArrivalCity,
  setDepartureDate,
  setReturnDate,
  setPassenger,
} = searchSlice.actions;

export default searchSlice.reducer;
