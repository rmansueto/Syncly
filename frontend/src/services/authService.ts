import axios, { AxiosError } from "axios";
import { LoginPayload, RegisterPayload, AuthResponse } from "../types/authTypes";

const API_URL = "http://localhost:8080/api";

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
  return response.data;
};

export const registerUser = async (data: RegisterPayload): Promise<any> => {
  const payload = { email: data.email, password: data.password, fullName: data.username ?? "" };
  const response = await axios.post<any>(`${API_URL}/auth/register`, payload);
  return response.data;
};


export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || "Server error occurred.";
  }
  return "Unexpected error occurred.";
};