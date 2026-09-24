import { useThemeStore } from "../store/themeStore";

export const useTheme = () => {
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeStore((state) => state.theme);
  const isLoading = useThemeStore((state) => state.isLoading);

  return {
    mode,
    theme,
    colors: theme.colors,
    isLoading,
  };
};