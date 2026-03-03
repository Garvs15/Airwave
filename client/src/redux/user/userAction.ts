import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import user from "../../api/services/user";
import Cookies from 'js-cookie';

export const signUp = createAsyncThunk(
  '/signup',
  async (payload: object, thunkApi: any) => {
    try {
      const response = await user.signUp(payload);
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        countryCode: response.data.data.countryCode,
        phone: response.data.data.phone,
        type: response.data.data.type
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
)

export const login = createAsyncThunk(
  '/login',
  async (payload: object, thunkApi: any) => {
    try {
      const response = await user.login(payload);
      const { token } = response.data.data;
      Cookies.set('token', token, { expires: 7 });
      return {
        id: response.data.data.user.id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        phone: response.data.data.user.phone,
        countryCode: response.data.data.user.countryCode,
        type: response.data.data.user.type,
        token
      };
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.otpVerified === false) {
        return thunkApi.rejectWithValue({ ...error, otpVerified: false });
      }
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)

export const sendOtp = createAsyncThunk(
  '/send-otp',
  async (payload: object, thunkApi: any) => {
    try {
      const response = await user.sendOtp(payload);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)

export const verifyOtp = createAsyncThunk(
  '/verify-otp',
  async (payload: object, thunkApi: any) => {
    try {
      const response = await user.verifyOtp(payload);
      const { token } = response.data.data;
      Cookies.set('token', token, { expires: 7 });
      return {
        id: response.data.data.user.id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        phone: response.data.data.user.phone,
        countryCode: response.data.data.user.countryCode,
        type: response.data.data.user.type,
        token
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)

export const getUser = createAsyncThunk(
  '/user',
  async (token: string, thunkApi: any) => {
    try {
      const response = await user.getUser(token);
      return {
        id: response.data.data.user.id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        phone: response.data.data.user.phone,
        countryCode: response.data.data.user.countryCode,
        type: response.data.data.user.type,
        token
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)

export const updateUser = createAsyncThunk(
  '/update-user',
  async (payload: object, thunkApi: any) => {
    try {
      const response = await user.updateUser(payload);
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        phone: response.data.data.phone,
        countryCode: response.data.data.countryCode,
        type: response.data.data.type,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)

export const validateEmail = createAsyncThunk (
  '/validateEmail',
  async (payload: object, thunkApi: any) => {
    try {
      const res = await user.validateEmail(payload);
      return res.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)

export const changePassword = createAsyncThunk (
  '/change-password',
  async (payload: object, thunkApi: any) => {
    try {
      const res = await user.changePassword(payload);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error as SerializedError);
    }
  }
)