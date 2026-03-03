import { configureStore, combineReducers } from '@reduxjs/toolkit';
import flightReducer from './flights/flightSlice';
import searchReducer from './searchSlice';
import singleFlightReducer from './flights/singleFlightSlice';
import singleReturnFlightReducer from './flights/singleReturnFlightSlice';
import passengerReducer from './passengers/passengerReducer';
import bookingReducer from './bookings/bookingSlice';
import airportReducer from './airports/airportSlice';
import userReducer from './user/userSlice';
import loadingReducer from './loadingSlice';

// Define the root reducer and its type
const rootReducer = combineReducers({
  flight: flightReducer,
  search: searchReducer,
  singleFlight: singleFlightReducer,
  singleReturnFlight: singleReturnFlightReducer,
  passengers: passengerReducer,
  airport: airportReducer,
  user: userReducer,
  booking: bookingReducer,
  loading: loadingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Create the store and its type
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

export default store;
