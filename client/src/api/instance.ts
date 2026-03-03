import axios, { AxiosInstance } from "axios";
import { AUTH_BASE_URL, BASE_URL, BOOKING_BASE_URL } from "./api";


export const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL
})

export const bookingInstance: AxiosInstance = axios.create({
  baseURL: BOOKING_BASE_URL
})

export const authInstance: AxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL
})