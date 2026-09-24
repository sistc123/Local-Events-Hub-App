export const validateEmail = (
  email: string
): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
};

export const validatePassword = (
  password: string
): boolean => {
  return password.length >= 8;
};

export const validateName = (
  name: string
): boolean => {
  return name.trim().length >= 2;
};

export const getValidationMessage = (
  email: string,
  password: string
): string | null => {
  if (!validateEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!validatePassword(password)) {
    return "Password must contain at least 8 characters.";
  }

  return null;
};