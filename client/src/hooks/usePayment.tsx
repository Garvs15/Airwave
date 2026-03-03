import axios from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetState } from "../redux/flights/flightSlice";
import { resetSingleFlight } from "../redux/flights/singleFlightSlice";
import { emptyPassengers } from "../redux/passengers/passengerActions";
import { RootState } from "../redux/store";
import { setLoading } from "../redux/loadingSlice";

declare var Razorpay: any;

const usePayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const singleFlight = useSelector((state: RootState) => state.singleFlight);
  const singleReturnFlight = useSelector(
    (state: RootState) => state.singleReturnFlight
  );

  const processPayment = useCallback(
    async (
      bookedSeats: any,
      price: number,
      booking_id: number,
      navigateToHome?: boolean
    ) => {
      dispatch(setLoading(true));

      try {
        const totalAmount = price * bookedSeats;
        const paymentResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_BOOKING_API}/payment/razorpay`,
          {
            booking_id: booking_id,
            amount: totalAmount + totalAmount * 0.1,
            user_id: user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              Accept: "application/json",
            },
          }
        );

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: paymentResponse.data.amount,
          currency: paymentResponse.data.currency,
          order_id: paymentResponse.data.id,
          handler: async (response: any) => {
            toast.success("Booking created.");
            dispatch(emptyPassengers());
            dispatch(resetState());
            dispatch(resetSingleFlight());
            navigate("/home");
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || "",
          },
          modal: {
            ondismiss: () => {
              toast("Payment pending");
              dispatch(emptyPassengers());
              dispatch(resetState());
              dispatch(resetSingleFlight());
              navigateToHome && navigate("/home");
            },
          },
        };

        console.log("🔑 Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY);
        console.log("💰 Order Response:", paymentResponse.data);
        console.log("🛠 Razorpay Options:", options);

        const rzp = new Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error processing payment", error);
        toast.error("Payment failed. Please try again.");
      } finally {
        dispatch(setLoading(false));
      }
    },
    [
      dispatch,
      navigate,
      singleFlight.price,
      singleReturnFlight.price,
      user.email,
      user.id,
      user.name,
    ]
  );

  return { processPayment };
};

export default usePayment;
