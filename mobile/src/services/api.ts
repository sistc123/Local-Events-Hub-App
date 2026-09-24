import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "../constants/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`,
      token
        ? "(TOKEN ATTACHED)"
        : "(NO TOKEN)"
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(
      "API RESPONSE:",
      response.status,
      response.config.url
    );

    return response;
  },
  async (error) => {
    console.log(
      "API ERROR:",
      error?.response?.status,
      error?.response?.data ||
        error?.message
    );

    return Promise.reject(error);
  }
);

export { api };

export default api;