import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

import { User } from "../types/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

// LOGIN
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const data = response.data;

  if (!data?.token || !data?.user) {
    throw new Error(
      data?.message || "Login response did not contain token/user."
    );
  }

  // Save the NEW JWT immediately
  await AsyncStorage.setItem(
    TOKEN_KEY,
    data.token
  );

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user)
  );

  return {
    success: true,
    message: data.message,
    token: data.token,
    user: data.user,
  };
};

// REGISTER
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  const data = response.data;

  if (!data?.token || !data?.user) {
    throw new Error(
      data?.message ||
        "Registration response did not contain token/user."
    );
  }

  await AsyncStorage.setItem(
    TOKEN_KEY,
    data.token
  );

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user)
  );

  return {
    success: true,
    message: data.message,
    token: data.token,
    user: data.user,
  };
};

// GET SAVED TOKEN
export const getSavedToken = async (): Promise<
  string | null
> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

// GET SAVED USER
export const getSavedUser = async (): Promise<
  User | null
> => {
  const user = await AsyncStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    await AsyncStorage.removeItem(USER_KEY);
    return null;
  }
};

// LOGOUT
export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_KEY,
  ]);
};