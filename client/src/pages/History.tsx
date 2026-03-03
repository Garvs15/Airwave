import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingCard from "../components/HistoryPage/BookingCard";
import { bookings } from "../redux/bookings/bookingAction";
import { addPage, resetPage } from "../redux/bookings/bookingSlice";
import { AppDispatch, RootState } from "../redux/store";

const History = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const booking = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    if (user.id && user.token) {
      dispatch(
        bookings({ userId: user.id, page: booking.page, token: user.token })
      );
    }

    return () => {
      dispatch(resetPage());
    };
  }, [dispatch, user.id, user.token]);

  useEffect(() => {
    if (booking.page > 1) {
      dispatch(
        bookings({ userId: user.id, page: booking.page, token: user.token })
      );
    }
  }, [dispatch, booking.page, user.id, user.token]);

  const handleViewMore = () => {
    // dispatch(bookings({ userId: user.id, page:booking.page+1, token: user.token }));
    dispatch(addPage());
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-75px)] flex flex-col items-center py-10 gap-10">
      <div className="text-2xl font-bold">History</div>
      {booking.bookings.length === 0 ? (
        <div>No booking history</div>
      ) : (
        <>
          {booking.bookings.map((item, index) => (
            <>
              <BookingCard key={index} booking={item} />
            </>
          ))}
          {booking.page < booking.totalPages && (
            <div
              className="flex justify-center items-center h-full mb-8 cursor-pointer"
              onClick={handleViewMore}
            >
              <div className="bg-white w-max py-2 px-4 rounded-full shadow-lg text-blue-500">
                View more
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
