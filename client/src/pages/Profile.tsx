import { TextInput } from "@mantine/core";
import Cookies from "js-cookie";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AppDispatch, RootState } from "../redux/store";
import { updateUser, validateEmail } from "../redux/user/userAction";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    countryCode: user.countryCode || '+91',
  });
  const [initialData, setInitialData] = useState(profileData);

  useEffect(() => {
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone!,
      countryCode: user.countryCode || '+91',
    });
    setInitialData({
      name: user.name,
      email: user.email,
      phone: user.phone!,
      countryCode: user.countryCode || '+91',
    });
  }, [user]);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const emailSchema = z.string().email("Please enter a valid email address.");
  const phoneSchema = z
    .string()
    .min(7, "Phone number must be at least 7 digits.")
    .max(15, "Phone number cannot exceed 15 digits.");

  const validateField = useCallback(
    debounce((field: string, value: string) => {
      if (field === "email") {
        const result = emailSchema.safeParse(value);
        setEmailError(result.success ? null : result.error.errors[0].message);
      } else if (field === "phone") {
        const result = phoneSchema.safeParse(value);
        setPhoneError(result.success ? null : result.error.errors[0].message);
      }
    }, 300),
    []
  );

  const handleInputChange = (field: string, value: string) => {
    validateField(field, value)
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (profileData.email !== initialData.email) {
        await dispatch(
          updateUser({
            id: user.id,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            countryCode: profileData.countryCode,
          })
        ).unwrap();
        setInitialData(profileData);
        Cookies.remove("token");
        navigate("/verify-otp", {state: {
          email: profileData.email
        }});
      } else {
        const res = await dispatch(
          updateUser({
            id: user.id,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            countryCode: profileData.countryCode,
          })
        ).unwrap();
        if (res) {
          setInitialData(profileData);
          toast.success('User updated successfully.');
        }
      }
    } catch (error: any) {
      toast.error(error?.response.data.message || "Please try again later.");
    }
  };

  const changePassword = async () => {
    try {
      const res = await dispatch(validateEmail({ email: user.email }));
      if (res.type === "/validateEmail/fulfilled") {
        toast.success("Change password link sent to email");
        navigate("/home");
      } else {
        toast.error(res.payload.response.data.message || 'Email not found.');
      }
    } catch (error: any) {
      toast.error(error?.message || "Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-75px)] bg-gray-50 py-10 px-4">
      {/* Heading */}
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">
        Profile Page
      </h1>

      {/* Form Section */}
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <TextInput
          label="Name"
          placeholder="Enter name"
          value={profileData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full"
        />
        <TextInput
          label="Email"
          placeholder="Enter email"
          value={profileData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full"
          type="email"
          error={emailError}
          disabled={user.type === 1}
        />
        <div className="w-full">
          <label className="block mb-2">Country Code</label>
          <PhoneInput
            defaultCountry="in"
            placeholder="Country Code"
            value={profileData.countryCode}
            onChange={(e) => handleInputChange("countryCode", e)}
            className="w-full"
            inputStyle={{ width: "100%" }}
            inputProps={{ readOnly: true }}
          />
        </div>
        <TextInput
          label="Phone Number"
          placeholder="Enter phone"
          value={profileData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full"
          error={phoneError}
          type="number"
        />
      </div>

      {user.type === 0 && (
        <div className="flex justify-center mt-6 w-full max-w-md">
          <button
            onClick={changePassword}
            className="mt-4 border border-blue-500 text-blue-500 transition py-2 px-4 rounded w-full"
            disabled={!!emailError}
          >
            Change Password
          </button>
        </div>
      )}
      <div className="flex justify-center w-full max-w-md mt-6">
        <button
          onClick={handleSave}
          className="mt-4 bg-orange-400 transition text-white py-2 px-4 rounded w-full"
          disabled={!!emailError}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
