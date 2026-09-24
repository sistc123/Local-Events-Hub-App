import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  loginUser,
  registerUser,
  getSavedUser,
  getSavedToken,
  logoutUser,
} from "../services/authService";

import { User } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  checkAuth: () => Promise<void>;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  updateUser: (
    user: User
  ) => void;

  logout: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,

    // -----------------------------------------
    // CHECK AUTH
    // -----------------------------------------

    checkAuth: async () => {
      try {
        const token =
          await getSavedToken();

        const user =
          await getSavedUser();

        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error(
          "CHECK AUTH ERROR:",
          error
        );

        await AsyncStorage.removeItem(
          "auth_token"
        );

        await AsyncStorage.removeItem(
          "auth_user"
        );

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },

    // -----------------------------------------
    // LOGIN
    // -----------------------------------------

    login: async (
      email,
      password
    ) => {
      set({
        isLoading: true,
      });

      try {
        const result =
          await loginUser(
            email,
            password
          );

        set({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
        });

        throw error;
      }
    },

    // -----------------------------------------
    // REGISTER
    // -----------------------------------------

    register: async (
      name,
      email,
      password
    ) => {
      set({
        isLoading: true,
      });

      try {
        const result =
          await registerUser(
            name,
            email,
            password
          );

        if (
          result.token &&
          result.user
        ) {
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            isLoading: false,
          });
        }
      } catch (error) {
        set({
          isLoading: false,
        });

        throw error;
      }
    },

    // -----------------------------------------
    // UPDATE USER
    // -----------------------------------------

    updateUser: (updatedUser) => {
      set((state) => ({
        user: updatedUser,
        token: state.token,
        isAuthenticated:
          state.isAuthenticated,
        isLoading: false,
      }));

      /*
       * Persist ONLY the updated user.
       *
       * The existing JWT is NOT changed.
       */
      AsyncStorage.setItem(
        "auth_user",
        JSON.stringify(updatedUser)
      ).catch((error) => {
        console.error(
          "SAVE UPDATED USER ERROR:",
          error
        );
      });
    },

    // -----------------------------------------
    // LOGOUT
    // -----------------------------------------

    logout: async () => {
      try {
        await logoutUser();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } catch (error) {
        console.error(
          "LOGOUT ERROR:",
          error
        );

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },
  }));