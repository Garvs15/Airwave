import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUser, login, signUp, updateUser, verifyOtp } from "./userAction";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  type: number;
  token?: string;
}

const initialState: User = {
  id: 0,
  name: '',
  email: '',
  phone: '',
  countryCode: '',
  type: 0,
  token: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => initialState,
    setName: (state, action:PayloadAction<string>) => {
      state.name = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setCountryCode: (state, action: PayloadAction<string>) => {
      state.countryCode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.countryCode = action.payload.countryCode;
      state.type = action.payload.type;
      state.id = action.payload.id;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      return action.payload;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action: PayloadAction<User>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.token = action.payload.token;
      state.countryCode = action.payload.countryCode;
      state.type = action.payload.type;
      state.phone = action.payload.phone;
    });
    builder.addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.phone = action.payload.phone;
      state.token = action.payload.token;
      state.countryCode = action.payload.countryCode;
      state.type = action.payload.type;
    });
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.phone = action.payload.phone;
      state.countryCode = action.payload.countryCode;
      state.type = action.payload.type;
      state.token = action.payload.token;
    });
  }
});

export const { logout, setEmail, setPhone, setCountryCode } = userSlice.actions;
export default userSlice.reducer;
