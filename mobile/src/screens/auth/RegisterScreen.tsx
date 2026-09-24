import React, {
  useState
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import {
  useNavigation
} from "@react-navigation/native";

import {
  useAuthStore
} from "../../store/authStore";

import {
  useTheme
} from "../../hooks/useTheme";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function RegisterScreen() {
  const navigation =
    useNavigation<any>();

  const theme = useTheme();

  const register =
    useAuthStore(
      (state) => state.register
    );

  const isLoading =
    useAuthStore(
      (state) => state.isLoading
    );

  const [
    fullName,
    setFullName
  ] = useState("");

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  const handleRegister =
    async () => {
      const name =
        fullName.trim();

      const emailValue =
        email.trim().toLowerCase();

      const passwordValue =
        password;

      const confirmPasswordValue =
        confirmPassword;

      if (!name) {
        Alert.alert(
          "Validation Error",
          "Please enter your full name."
        );
        return;
      }

      if (!emailValue) {
        Alert.alert(
          "Validation Error",
          "Please enter your email address."
        );
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailValue)) {
        Alert.alert(
          "Validation Error",
          "Please enter a valid email address."
        );
        return;
      }

      if (!passwordValue) {
        Alert.alert(
          "Validation Error",
          "Please enter a password."
        );
        return;
      }

      if (passwordValue.length < 6) {
        Alert.alert(
          "Validation Error",
          "Password must be at least 6 characters."
        );
        return;
      }

      if (!confirmPasswordValue) {
        Alert.alert(
          "Validation Error",
          "Please confirm your password."
        );
        return;
      }

      if (
        passwordValue !==
        confirmPasswordValue
      ) {
        Alert.alert(
          "Password Mismatch",
          "Password and Confirm Password do not match."
        );
        return;
      }

      try {
        await register(
          name,
          emailValue,
          passwordValue
        );
      } catch (error: any) {
        Alert.alert(
          "Registration Failed",
          error?.response?.data?.message ||
            error?.message ||
            "Unable to create your account. Please try again."
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
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text
            style={[
              styles.title,
              {
                color:
                  theme.colors.text
              }
            ]}
          >
            Create Account
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  theme.colors.secondaryText
              }
            ]}
          >
            Join Local Events Hub
          </Text>

          <Text
            style={[
              styles.label,
              {
                color:
                  theme.colors.text
              }
            ]}
          >
            Full Name
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  theme.colors.input,
                borderColor:
                  theme.colors.border,
                color:
                  theme.colors.text
              }
            ]}
            placeholder="Enter your full name"
            placeholderTextColor={
              theme.colors.secondaryText
            }
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            editable={!isLoading}
          />

          <Text
            style={[
              styles.label,
              {
                color:
                  theme.colors.text
              }
            ]}
          >
            Email
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  theme.colors.input,
                borderColor:
                  theme.colors.border,
                color:
                  theme.colors.text
              }
            ]}
            placeholder="Enter your email"
            placeholderTextColor={
              theme.colors.secondaryText
            }
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text
            style={[
              styles.label,
              {
                color:
                  theme.colors.text
              }
            ]}
          >
            Password
          </Text>

          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor:
                  theme.colors.input,
                borderColor:
                  theme.colors.border
              }
            ]}
          >
            <TextInput
              style={[
                styles.passwordInput,
                {
                  color:
                    theme.colors.text
                }
              ]}
              placeholder="Enter your password"
              placeholderTextColor={
                theme.colors.secondaryText
              }
              value={password}
              onChangeText={setPassword}
              secureTextEntry={
                !showPassword
              }
              autoCapitalize="none"
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.showText,
                  {
                    color:
                      theme.colors.primary
                  }
                ]}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.label,
              {
                color:
                  theme.colors.text
              }
            ]}
          >
            Confirm Password
          </Text>

          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor:
                  theme.colors.input,
                borderColor:
                  theme.colors.border
              }
            ]}
          >
            <TextInput
              style={[
                styles.passwordInput,
                {
                  color:
                    theme.colors.text
                }
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={
                theme.colors.secondaryText
              }
              value={
                confirmPassword
              }
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry={
                !showConfirmPassword
              }
              autoCapitalize="none"
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.showText,
                  {
                    color:
                      theme.colors.primary
                  }
                ]}
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {confirmPassword.length > 0 &&
            password !==
              confirmPassword && (
              <Text
                style={[
                  styles.errorText,
                  {
                    color:
                      theme.colors.danger
                  }
                ]}
              >
                Passwords do not match.
              </Text>
            )}

          {confirmPassword.length > 0 &&
            password ===
              confirmPassword && (
              <Text
                style={[
                  styles.successText,
                  {
                    color:
                      theme.colors.success
                  }
                ]}
              >
                Passwords match.
              </Text>
            )}

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  theme.colors.primary
              }
            ]}
            onPress={
              handleRegister
            }
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text
              style={styles.buttonText}
            >
              {isLoading
                ? "Creating Account..."
                : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View
            style={
              styles.loginContainer
            }
          >
            <Text
              style={[
                styles.loginText,
                {
                  color:
                    theme.colors.secondaryText
                }
              ]}
            >
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Login"
                )
              }
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.loginLink,
                  {
                    color:
                      theme.colors.primary
                  }
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1
    },

    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24
    },

    formContainer: {
      width: "100%"
    },

    title: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 8
    },

    subtitle: {
      fontSize: 16,
      marginBottom: 28
    },

    label: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 8
    },

    input: {
      height: 52,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 16,
      fontSize: 16,
      marginBottom: 18
    },

    passwordContainer: {
      height: 52,
      borderWidth: 1,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 16,
      paddingRight: 12,
      marginBottom: 18
    },

    passwordInput: {
      flex: 1,
      fontSize: 16
    },

    showText: {
      fontSize: 14,
      fontWeight: "600",
      paddingLeft: 10
    },

    errorText: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 12
    },

    successText: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 12
    },

    button: {
      height: 52,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700"
    },

    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24
    },

    loginText: {
      fontSize: 14
    },

    loginLink: {
      fontSize: 14,
      fontWeight: "700",
      marginLeft: 5
    }
  });