import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import Image from "../components/common/Image";
import AuthForm from "../components/SignUpPage/AuthForm";
import SocialLogin from "../components/SignUpPage/SocialLogin";
import ToggleSwitch from "../components/SignUpPage/ToggleSwitch";
import { AppDispatch } from "../redux/store";
import { login, signUp } from "../redux/user/userAction";
import { setEmail } from "../redux/user/userSlice";
import debounce from "lodash.debounce";

export interface FormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const emailSchema = z.string().email("Please enter a valid email address.");
  const passwordSchema = z.string().min(4, "Password must be at least 6 characters.");

  const validateField = useCallback(
    debounce((field: string, value: string) => {
      if (field === "email") {
        const result = emailSchema.safeParse(value);
        setEmailError(result.success ? null : result.error.errors[0].message);
      }
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    validateField(name, value)
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateFormData = (): boolean => {
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (!emailSchema.safeParse(formData.email).success) {
      setEmailError("Invalid email format.");
      return false;
    }
    if (!passwordSchema.safeParse(formData.password).success) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateFormData()) return;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      if (isLogin) {
        dispatch(setEmail(formData.email));
        await dispatch(login(payload)).unwrap();
        toast.success("Login successful");
        navigate("/home");
      } else {
        await dispatch(signUp(payload)).unwrap();
        toast.success("User created");
        navigate("/verify-otp", { state: { email: formData.email } });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "An error occurred.";
      toast.error(message);
      if (error?.otpVerified === false) navigate("/verify-otp");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error) {
      toast.error(error);
      navigate("/auth");
    }
  }, [location.search, navigate]);

  const animateAuthToggle = (): void => {
    const direction = isLogin ? "100%" : "0%";
    const color_in = isLogin ? "black" : "white";
    const color_out = isLogin ? "white" : "black";
    gsap.to(".button_in", { x: direction, duration: 0.1, ease: "expo.in" });
    gsap.to(".text_in", { color: color_in, duration: 0.2 });
    gsap.to(".text_out", { color: color_out, duration: 0.2 });

    gsap.fromTo(
      ".heading",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    gsap.fromTo(
      ".form",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
    );

    gsap.fromTo(
      ".or",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", delay: 0.2 }
    );

    gsap.fromTo(
      ".social > button",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.3,
      }
    );
  };

  const toggleAuthMode = (): void => {
    setFormData({ name: "", email: "", password: "" });
    animateAuthToggle();
  };

  useGSAP(() => {
    gsap.from(".container", {
      y: 100,
      duration: 1,
    });
    gsap.from(".toggle", {
      y: -50,
      duration: 1,
    });
  });

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 bg-white items-center justify-center p-8">
        <ToggleSwitch
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          toggleAuthMode={toggleAuthMode}
        />
        <div className="container w-full flex flex-col items-center justify-center">
          <h2 className="heading text-3xl font-semibold mb-6 text-gray-900 text-center w-[90%] sm:w-[65%] mmd:w-[50%] md:w-[80%] lg:w-[60%] llg:w-[50%]">
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </h2>
          <AuthForm
            isLogin={isLogin}
            formData={formData}
            emailError={emailError}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
          <div className="or my-4 flex items-center justify-center w-[90%] sm:w-[65%] mmd:w-[50%] md:w-[80%] lg:w-[70%] llg:w-[55%]">
            <div className="border-b w-full"></div>
            <span className="mx-4 text-sm text-gray-500">Or</span>
            <div className="border-b w-full"></div>
          </div>
          <SocialLogin />
        </div>
      </div>
      <Image src={require("../assets/signupImage.jpg")} alt="Signup" />
    </div>
  );
};

export default Signup;
