import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import Image from "../components/common/Image";
import { AppDispatch } from "../redux/store";
import { changePassword } from "../redux/user/userAction";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const schema = z.object({
    newPassword: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string().min(4, "Confirm password is required"),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

  const validatePasswords = () => {
    try {
      schema.parse({ newPassword, confirmPassword });
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasswords()) {
      try {
        const res = await dispatch(changePassword({ email, password: newPassword })).unwrap();
        if (res) {
          toast.success(res.message || "Password changed successfully.");
          navigate("/home");
        } else {
          toast.error("Not able to change password");
        }
      } catch (error: any) {
        toast.error(error.response.data.message || "Error changing password");
      }
    }
  };

  useEffect(() => {
    if (!email) {
      toast.error("Change password from profile page.");
      navigate("/home");
    }
  }, [email, navigate]);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 bg-white items-center justify-center p-8">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mb-6 w-[90%] sm:w-[65%] md:w-[80%] lg:w-[60%]">
            <h2 ref={titleRef} className="text-3xl font-semibold text-gray-900 text-center max-xs:text-2xl">
              Set New Password
            </h2>
          </div>

          <form ref={formRef} className="w-[90%] sm:w-[65%] md:w-[80%] lg:w-[60%]" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`border rounded w-full py-2 px-3 text-gray-700 ${error ? 'border-red-500' : ''}`}
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`border rounded w-full py-2 px-3 text-gray-700 ${error ? 'border-red-500' : ''}`}
                placeholder="Confirm new password"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                ref={buttonRef}
                type="submit"
                className="bg-[#162D3A] text-white font-medium py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <Image src={require("../assets/signupImage.jpg")} alt="ChangePassword" />
    </div>
  );
};

export default ChangePassword;
