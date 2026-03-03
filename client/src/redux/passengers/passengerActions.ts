import { ADD_PASSENGER, EMPTY_PASSENGERS, UPDATE_PASSENGER_DETAILS } from './passengerActionTypes';
import { Passenger } from './passengerReducer';

export const addPassenger = () => ({
  type: ADD_PASSENGER,
});

export const updatePassengerDetails = (index: number, details: Passenger) => ({
  type: UPDATE_PASSENGER_DETAILS,
  payload: { index, details }
});

export const emptyPassengers = () => ({
  type: EMPTY_PASSENGERS,
});