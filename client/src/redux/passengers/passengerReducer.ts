import { ADD_PASSENGER, EMPTY_PASSENGERS, UPDATE_PASSENGER_DETAILS } from './passengerActionTypes';

export interface Passenger {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  countryCode?: string;
  passportNo?: string;
  passportCountry?: string;
  passportExpiry?: string
}

interface PassengerState {
  passengers: Passenger[];
}

const initialState: PassengerState = {
  passengers: [],
};

const passengerReducer = (state = initialState, action: any): PassengerState => {
  switch (action.type) {
    case ADD_PASSENGER:
      return {
        ...state,
        passengers: [...state.passengers, {}],
      };

    case UPDATE_PASSENGER_DETAILS:
      const { index, details } = action.payload;
      return {
        ...state,
        passengers: state.passengers.map((passenger, i) =>
          i === index ? details : passenger
        ),
      };
    case EMPTY_PASSENGERS:
      return {
        ...state,
        passengers: [],
      };

    default:
      return state;
  }
};

export default passengerReducer;
