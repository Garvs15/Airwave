import { BOOK_FLIGHT, BOOKINGS, GET_BOOKING_BYID } from "../api";
import { bookingHttp } from "../bookingHttp";


class booking{
  bookFlight(payload: object, token: string){
    return bookingHttp.post(BOOK_FLIGHT, payload, 'application/json', token)
  }
  bookings(payload: object, token: string){
    return bookingHttp.post(BOOKINGS, payload, 'application/json', token);
  }
  getBookingById(payload: object, token: string){
    return bookingHttp.post(GET_BOOKING_BYID, payload, 'application/json', token);
  }
}

const bookingInstance = new booking();
export default bookingInstance;