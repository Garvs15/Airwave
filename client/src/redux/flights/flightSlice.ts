import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";
import { getFlightsData } from "./flightsAction";

interface Airplane {
  modelNumber: string;
  capacity: number;
}

interface Airport {
  name: string;
  city: string;
}

export interface Flight {
  id: number;
  flightNumber: string;
  flight: Airplane;
  arrivalAirport: Airport;
  arrivalTime: string;
  departureAirport: Airport;
  departureTime: string;
  price: number;
  nextDay: number;
  flightTime: string;
  isInternational: boolean;
}

interface FlightState {
  departureFlight: Flight[];
  returnFlight: Flight[];
  departurePage: number;
  returnPage: number;
  totalDeparturePages: number;
  totalReturnPages: number;
  totalFlights: number;
  filterTime: Dayjs | null;
  isDeparture: boolean;
  maxPrice: number;
  minPrice: number;
  departureAirportId: string | number;
  returnAirportId: string | number;
}

const initialState: FlightState = {
  departureFlight: [],
  returnFlight: [],
  departurePage: 1,
  returnPage: 1,
  totalDeparturePages: 1,
  totalReturnPages: 1,
  totalFlights: 0,
  filterTime: null,
  maxPrice: 50000,
  minPrice: 2000,
  isDeparture: true,
  departureAirportId: "",
  returnAirportId: "",
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {
    setDepartureFlight: (
      state: FlightState,
      action: PayloadAction<Flight[]>
    ) => {
      state.departureFlight = action.payload;
    },
    resetDepartureFlightState: (state: FlightState) => {
      state.departureFlight = [];
    },
    setReturnFlight: (state: FlightState, action: PayloadAction<Flight[]>) => {
      state.returnFlight = action.payload;
    },
    resetReturnFlightState: (state: FlightState) => {
      state.returnFlight = [];
    },
    increaseDeparturePage: (state: FlightState) => {
      state.departurePage += 1;
    },
    increaseReturnPage: (state: FlightState) => {
      state.returnPage += 1;
    },
    resetDeparturePage: (state: FlightState) => {
      state.departurePage = 0;
    },
    resetReturnPage: (state: FlightState) => {
      state.returnPage = 0;
    },
    setFilterTime: (
      state: FlightState,
      action: PayloadAction<Dayjs | null>
    ) => {
      state.filterTime = action.payload;
    },
    setisDeparture: (state: FlightState, action: PayloadAction<boolean>) => {
      state.isDeparture = action.payload;
    },
    setMaxPrice: (state: FlightState, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    setMinPrice: (state: FlightState, action: PayloadAction<number>) => {
      state.minPrice = action.payload;
    },
    setDepartureAirportId: (
      state: FlightState,
      action: PayloadAction<string | number>
    ) => {
      state.departureAirportId = action.payload;
    },
    setReturnAirportId: (
      state: FlightState,
      action: PayloadAction<string | number>
    ) => {
      state.returnAirportId = action.payload;
    },
    resetState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFlightsData.fulfilled, (state, action) => {
      console.log("Flights slice updating state:", action.payload);

      if (action.payload.type === "Departure") {
        if (action.payload.page === 1) {
          state.departureFlight = action.payload.data;
        } else {
          state.departureFlight = [
            ...state.departureFlight,
            ...action.payload.data,
          ];
        }
        state.totalFlights = action.payload.totalFlights;
        state.totalDeparturePages = action.payload.totalPages;
        state.departurePage = action.payload.page;
      } else if (action.payload.type === "Return") {
        if (action.payload.page === 1) {
          state.returnFlight = action.payload.data;
        } else {
          state.returnFlight = [...state.returnFlight, ...action.payload.data];
        }
        state.totalFlights = action.payload.totalFlights;
        state.totalReturnPages = action.payload.totalPages;
        state.returnPage = action.payload.page;
      }
    });
    builder.addCase(getFlightsData.rejected, (state, action) => {
      // console.log("rejected");
    });
  },
});

export const {
  setDepartureFlight,
  resetDepartureFlightState,
  setReturnFlight,
  resetReturnFlightState,
  increaseDeparturePage,
  increaseReturnPage,
  resetDeparturePage,
  resetReturnPage,
  setFilterTime,
  setisDeparture,
  setMaxPrice,
  setMinPrice,
  setDepartureAirportId,
  setReturnAirportId,
  resetState,
} = flightSlice.actions;

export default flightSlice.reducer;
