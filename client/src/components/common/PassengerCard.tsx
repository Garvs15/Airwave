import { Select, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import React, { useMemo, useState, useCallback } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useDispatch } from "react-redux";
import { updatePassengerDetails } from "../../redux/passengers/passengerActions";
import DatePickerModal from "./DatePickerModal";
import countryList from "react-select-country-list";
import { z } from "zod";
import debounce from "lodash.debounce";

const PassengerCard = ({
  passenger,
  index,
  isInternational,
  fromHistory,
}: {
  passenger: any;
  index: number;
  isInternational: boolean;
  fromHistory: boolean;
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const options = useMemo(() => {
    return countryList()
      .getData()
      .map((country) => ({
        label: country.label,
        value: country.label,
      }));
  }, []);

  // Zod schema for validation
  const emailSchema = z.string().email("Please enter a valid email address.");
  const phoneSchema = z
    .string()
    .min(7, "Phone number must be at least 7 digits.")
    .max(15, "Phone number cannot exceed 15 digits.");

  // Debounced validation
  const validateField = useCallback(
    debounce((field: string, value: string) => {
      if (field === "email") {
        const result = emailSchema.safeParse(value);
        setEmailError(result.success ? null : result.error.errors[0].message);
      } else if (field === "phoneNumber") {
        const result = phoneSchema.safeParse(value);
        setPhoneError(result.success ? null : result.error.errors[0].message);
      }
    }, 300),
    []
  );

  const handleInputChange = (field: string, value: string) => {
    // Trigger validation
    validateField(field, value);

    dispatch(
      updatePassengerDetails(index, {
        ...passenger,
        [field]: value,
      })
    );
  };

  const handleDateChange = (date: any) => {
    handleInputChange("dob", date ? date.format("YYYY-MM-DD") : "");
    setOpen(false);
  };

  const requiredLabel = (label: string) => (
    <>
      {label} <span className="text-red-500">*</span>
    </>
  );

  return (
    <div className="bg-white w-[50%] max-lg:w-[70%] max-md:w-[90%] rounded-md">
      <div className="border-b justify-center flex py-6 items-center text-lg font-semibold">
        Passenger Details
      </div>
      <div className="flex-wrap flex justify-evenly shadow-inner py-6 gap-y-6">
        <TextInput
          label={requiredLabel("Name")}
          placeholder="Enter name"
          value={passenger.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-[45%]"
          disabled={fromHistory}
        />
        <TextInput
          label={requiredLabel("Email")}
          placeholder="Enter email"
          value={passenger.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-[45%]"
          type="email"
          error={emailError}
          disabled={fromHistory}
        />
        <div className="w-[45%]">
          {requiredLabel("Country Code")}
          <PhoneInput
            defaultCountry="in"
            placeholder="Country Code"
            value={passenger.countryCode || ""}
            onChange={(e) => handleInputChange("countryCode", e)}
            className="w-full"
            inputStyle={{ width: "100%" }}
            countrySelectorStyleProps={{ buttonStyle: { width: "50px" } }}
            inputProps={{
              readOnly: true,
            }}
            disabled={fromHistory}
          />
        </div>
        <TextInput
          label={requiredLabel("Phone Number")}
          placeholder="Enter phone"
          value={passenger.phoneNumber || ""}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          className="w-[45%]"
          type="number"
          error={phoneError}
          disabled={fromHistory}
        />
        <Select
          label={requiredLabel("Gender")}
          placeholder="Select gender"
          value={passenger.gender || ""}
          onChange={(value) => handleInputChange("gender", value!)}
          data={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
          className="w-[45%]"
          disabled={fromHistory}
        />
        <TextInput
          label={requiredLabel("Date of Birth")}
          placeholder="Select date of birth"
          value={passenger.dob || ""}
          onClick={() => setOpen(true)}
          className="w-[45%]"
          readOnly
          disabled={fromHistory}
        />
        {isInternational && (
          <>
            <TextInput
              label={requiredLabel("Passport No")}
              placeholder="Enter passport no"
              value={passenger.passportNo || ""}
              onChange={(e) => handleInputChange("passportNo", e.target.value)}
              className="w-[45%]"
              disabled={fromHistory}
            />
            <Select
              label={requiredLabel("Passport Country")}
              placeholder="Enter passport country"
              value={passenger.passportCountry || ""}
              onChange={(value) => handleInputChange("passportCountry", value!)}
              data={options}
              className="w-[45%]"
              disabled={fromHistory}
            />
            <TextInput
              label={requiredLabel("Passport Expiry")}
              placeholder="Enter passport expiry"
              value={passenger.passportExpiry || ""}
              onChange={(e) =>
                handleInputChange("passportExpiry", e.target.value)
              }
              className="w-[45%]"
              disabled={fromHistory}
            />
          </>
        )}
      </div>
      <DatePickerModal
        open={open}
        handleClose={() => setOpen(false)}
        selectedDate={passenger.dob ? dayjs(passenger.dob) : null}
        handleDateChange={handleDateChange}
        title="Select Date of Birth"
        maxDate={dayjs().subtract(5, 'year')}
      />
    </div>
  );
};

export default PassengerCard;