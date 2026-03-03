import { TextInput } from "@mantine/core";
import React from "react";
import { FormData } from "../../pages/Signup";

interface AuthFormProp {
  isLogin: boolean,
  formData: FormData,
  emailError: string | null,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

const AuthForm = ({
  isLogin,
  formData,
  emailError,
  handleChange,
  handleSubmit,
} : AuthFormProp) => (
  <form
    className="form w-[90%] sm:w-[65%] mmd:w-[50%] md:w-[80%] lg:w-[70%] llg:w-[55%]"
    onSubmit={handleSubmit}
  >
    {!isLogin && (
      <TextInput
        key="name"
        label={"Name"}
        placeholder="Enter name"
        className="w-full mb-4"
        type="text"
        onChange={handleChange}
        value={formData.name}
        name="name"
        styles={{
          input: {
            borderRadius: "8px",
            backgroundColor: "#F7FBFF",
            height: "40px",
          },
        }}
      />
    )}
    <TextInput
      key="email"
      label={"Email"}
      placeholder="Enter email"
      className="w-full"
      type="email"
      name="email"
      error={emailError}
      value={formData.email}
      onChange={handleChange}
      styles={{
        input: {
          borderRadius: "8px",
          backgroundColor: "#F7FBFF",
          height: "40px",
        },
      }}
    />
    <TextInput
      key="password"
      label={"Password"}
      placeholder="Enter password"
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="w-full my-4"
      styles={{
        input: {
          borderRadius: "8px",
          backgroundColor: "#F7FBFF",
          height: "40px",
        },
      }}
    />
    {isLogin && (
      <div className="flex items-center justify-end mt-2">
        <a
          className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-700"
          href="/validate-email"
        >
          Forgot Password?
        </a>
      </div>
    )}
    <div className="flex items-center justify-center mt-6">
      <button
        className="bg-[#162D3A] text-white font-medium py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
        type="submit"
      >
        {isLogin ? "Sign in" : "Sign up"}
      </button>
    </div>
  </form>
);

export default AuthForm;
