import { TextInput } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Image from "../components/common/Image";
import { AppDispatch } from "../redux/store";
import { validateEmail } from "../redux/user/userAction";
import { gsap } from "gsap";

const ValidateEmail = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const emailSchema = z.string().email("Please enter a valid email address.");

  // References for GSAP animations
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
    } else {
      setEmailError(null);
      const res = await dispatch(validateEmail({ email }));
      if (res.payload) {
        toast.success("Change password link sent to email");
        navigate("/auth");
      } else {
        toast.error("Email doesn't exist");
      }
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth"); // Navigate to the login page
  };

  useEffect(() => {
    // GSAP animations
    gsap.from(titleRef.current, {
      duration: 1,
      opacity: 0,
      y: -30,
      ease: "power3.out",
    });

    gsap.from(formRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(buttonRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: "power3.out",
      delay: 0.4,
    });

    gsap.from(backButtonRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: "power3.out",
      delay: 0.6,
    });
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 bg-white items-center justify-center p-8">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mb-6 w-[90%] sm:w-[65%] md:w-[80%] lg:w-[60%]">
            <h2
              ref={titleRef}
              className="text-3xl font-semibold text-gray-900 text-center max-xs:text-2xl"
            >
              Change Password 🔑
            </h2>
          </div>

          <form
            ref={formRef}
            className="w-[90%] sm:w-[65%] md:w-[80%] lg:w-[60%]"
            onSubmit={handleNext}
          >
            <div className="relative">
              <TextInput
                label="Email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                className="w-full"
                type="email"
                error={emailError}
              />
            </div>
            <div className="w-full mt-1">
              <div
                onClick={handleBackToLogin}
                className="cursor-pointer text-blue-500 text-end"
              >
                Back to Login
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                ref={buttonRef}
                type="submit"
                className="bg-[#162D3A] text-white font-medium py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
      <Image src={require("../assets/signupImage.jpg")} alt="ChangePassword" />
    </div>
  );
};

export default ValidateEmail;
