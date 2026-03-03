import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Image from "../components/common/Image";
import { AppDispatch, RootState } from "../redux/store";
import { sendOtp, updateUser, verifyOtp } from "../redux/user/userAction";
import { gsap } from "gsap";

const VerifyOTP = () => {
  const location = useLocation();
  const emailFromNavigation = location.state?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { id, email } = useSelector((state: RootState) => state.user);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(email || emailFromNavigation);
  const [resendCooldown, setResendCooldown] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);

  const handleOtpChange = (otp: string) => {
    setOtp(otp);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isChangingEmail) {
      try {
        await dispatch(updateUser({ id, email: newEmail })).unwrap();
        await dispatch(sendOtp({ email: newEmail })).unwrap();
        toast.success("OTP sent to new email successfully");
        setIsChangingEmail(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    } else {
      if (otp.length === 5) {
        const payload = {
          email: newEmail,
          otp: otp,
        };
        try {
          await dispatch(verifyOtp(payload)).unwrap();
          toast.success("OTP verified");
          navigate("/home");
        } catch (error: any) {
          toast.error(error.response?.data?.message || "An error occurred.");
        }
      } else {
        setOtpError("Please enter a valid 5-digit OTP.");
      }
    }
  };

  const sendOtpToEmail = async () => {
    if (resendCooldown > 0) return;

    try {
      await dispatch(sendOtp({ email: newEmail })).unwrap();
      toast.success("OTP sent successfully");
      setOtpSent(true);
      setResendCooldown(30); // Set cooldown to 30 seconds
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    if (!otpSent) {
      sendOtpToEmail();
    }

    const cooldownInterval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(cooldownInterval);
  }, [otpSent]);

  // GSAP Animation on mount
  useEffect(() => {
    if (h2Ref.current && formRef.current) {
      gsap.from(h2Ref.current, { y: -50, opacity: 0, duration: 1 });
      gsap.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
      });
    }
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 bg-white items-center justify-center p-8">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h2 ref={h2Ref} className="text-3xl font-semibold mb-6 text-gray-900 text-center w-[90%] sm:w-[65%] mmd:w-[50%] md:w-[80%] lg:w-[60%] llg:w-[50%]">
            {isChangingEmail ? "Change Email" : "Verify OTP 📩"}
          </h2>
          <form
            ref={formRef}
            className="w-[90%] sm:w-[65%] mmd:w-[50%] md:w-[80%] lg:w-[60%] llg:w-[50%]"
            onSubmit={handleVerify}
          >
            {isChangingEmail ? (
              <div className="mb-4">
                <input
                  type="email"
                  value={newEmail}
                  onChange={handleEmailChange}
                  placeholder="Enter new email"
                  className="w-full p-2 border bg-richblack-800 rounded-[0.5rem] text-richblack-5"
                />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={5}
                    containerStyle="otp-container"
                    inputStyle="otp-input"
                    renderInput={(props) => (
                      <input
                        {...props}
                        placeholder="-"
                        className="w-[48px] lg:w-[60px] border bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                        style={{
                          boxShadow:
                            "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                      />
                    )}
                  />
                  {otpError && (
                    <p className="text-red-500 text-sm mt-2">{otpError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 cursor-pointer">
                  <button
                    type="button"
                    className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => setIsChangingEmail(true)}
                  >
                    Change Email?
                  </button>
                  <button
                    type="button"
                    onClick={sendOtpToEmail}
                    disabled={resendCooldown > 0}
                    className={`text-sm ${
                      resendCooldown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-500 hover:text-blue-700"
                    }`}
                  >
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            <div className="flex items-center justify-center mt-6">
              <button
                className="bg-[#162D3A] text-white font-medium py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isChangingEmail ? "Next" : "Verify OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Image src={require("../assets/signupImage.jpg")} alt="VerifyOtp" />
    </div>
  );
};

export default VerifyOTP;
