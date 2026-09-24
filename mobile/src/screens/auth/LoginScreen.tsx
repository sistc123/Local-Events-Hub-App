import React, {
  useState
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import {
  NativeStackScreenProps
} from "@react-navigation/native-stack";

import PrimaryButton from "../../components/PrimaryButton";

import {
  useAuthStore
} from "../../store/authStore";

import {
  useTheme
} from "../../hooks/useTheme";

import {
  validateEmail,
  validatePassword
} from "../../utils/validation";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "Login"
  >;

export default function LoginScreen({
  navigation
}: Props) {
  const theme = useTheme();

  const login =
    useAuthStore(
      (state) => state.login
    );

  const isLoading =
    useAuthStore(
      (state) => state.isLoading
    );

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const handleLogin =
    async () => {
      if (!validateEmail(email)) {
        Alert.alert(
          "Invalid Email",
          "Please enter a valid email."
        );
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert(
          "Invalid Password",
          "Password must contain at least 8 characters."
        );
        return;
      }

      try {
        await login(
          email.trim(),
          password
        );
      } catch (error: any) {
        Alert.alert(
          "Login Failed",
          error?.response?.data
            ?.message ||
            "Unable to login."
        );
      }
    };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background
        }
      ]}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.logo,
            {
              color:
                theme.colors.primary
            }
          ]}
        >
          Local Events Hub
        </Text>

        <Text
          style={[
            styles.heading,
            {
              color:
                theme.colors.text
            }
          ]}
        >
          Welcome Back
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={
            theme.colors.secondaryText
          }
          keyboardType="email-address"
          autoCapitalize="none"
          style={[
            styles.input,
            {
              backgroundColor:
                theme.colors.input,
              color:
                theme.colors.text,
              borderColor:
                theme.colors.border
            }
          ]}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={
            theme.colors.secondaryText
          }
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor:
                theme.colors.input,
              color:
                theme.colors.text,
              borderColor:
                theme.colors.border
            }
          ]}
        />

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
        />

        <Text
          onPress={() =>
            navigation.navigate(
              "Register"
            )
          }
          style={[
            styles.link,
            {
              color:
                theme.colors.primary
            }
          ]}
        >
          Don't have an account?
          {" "}Create Account
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1
    },

    content: {
      flex: 1,
      justifyContent: "center",
      padding: 24
    },

    logo: {
      fontSize: 30,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 30
    },

    heading: {
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 20
    },

    input: {
      minHeight: 52,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 15,
      marginBottom: 12,
      fontSize: 16
    },

    link: {
      textAlign: "center",
      marginTop: 16,
      fontSize: 15,
      fontWeight: "600"
    }
  });