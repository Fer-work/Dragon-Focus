import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        base: {
          100: "#f2efe6", // light neutral (text)
          200: "#b22222", // firebrick
          300: "#ff7043", // primary orange
          400: "#ffd700", // accent (gold)
          500: "#1a1a1a", // background
          600: "#121212", // deeper background
          700: "#0d0d0d", // darker background
          800: "#080808", // very dark
          900: "#000000", // black
        },
        primary: {
          100: "#fff0e6",
          200: "#ffcbb3",
          300: "#ffad80",
          400: "#ff9066",
          500: "#ff7043", // match --primary-color
          600: "#cc5936",
          700: "#994329",
          800: "#662c1b",
          900: "#33160e",
        },
        secondary: {
          100: "#e0d1f2",
          200: "#c1a3e6",
          300: "#a375d9",
          400: "#8447cc",
          500: "#4b0082", // match --secondary-color
          600: "#3a0068",
          700: "#2a004e",
          800: "#190034",
          900: "#0a001a",
        },
        accent: {
          100: "#fff8cc",
          200: "#fff099",
          300: "#ffe866",
          400: "#ffe033",
          500: "#ffd700", // match --accent-color
          600: "#cca900",
          700: "#997c00",
          800: "#665200",
          900: "#332600",
        },
      }
    : {
        base: {
          900: "#f2efe6",
          800: "#b22222",
          700: "#ff7043",
          600: "#ffd700",
          500: "#ffffff",
          400: "#eeeeee",
          300: "#cccccc",
          200: "#999999",
          100: "#666666",
        },
        primary: {
          900: "#ff7043",
          800: "#cc5936",
          700: "#994329",
          600: "#662c1b",
          500: "#33160e",
          400: "#1a0b07",
          300: "#0d0604",
          200: "#070302",
          100: "#000000",
        },
        secondary: {
          900: "#4b0082",
          800: "#3a0068",
          700: "#2a004e",
          600: "#190034",
          500: "#0a001a",
          400: "#06000f",
          300: "#030008",
          200: "#010004",
          100: "#000000",
        },
        accent: {
          900: "#ffd700",
          800: "#cca900",
          700: "#997c00",
          600: "#665200",
          500: "#332600",
          400: "#1a1300",
          300: "#0d0900",
          200: "#070400",
          100: "#000000",
        },
      }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode,
      primary: {
        main: colors.primary[500],
      },
      secondary: {
        main: colors.secondary[500],
      },
      background: {
        default: colors.base[500],
        paper: colors.base[600],
        fire: colors.base[200],
      },
      text: {
        primary: colors.base[100],
        secondary: colors.accent[300],
      },
      accent: {
        main: colors.accent[500],
      },
    },
    typography: {
      fontFamily: "'MedievalSharp', cursive", // Apply the MedievalSharp font
      fontSize: 14,
      h1: {
        fontFamily: "'MedievalSharp', cursive",
        fontSize: 40,
      },
      h2: {
        fontFamily: "'MedievalSharp', cursive",
        fontSize: 32,
      },
      h3: {
        fontFamily: "'MedievalSharp', cursive",
        fontSize: 24,
      },
      h4: {
        fontFamily: "'MedievalSharp', cursive",
        fontSize: 20,
      },
      h5: {
        fontFamily: "'MedievalSharp', cursive",
        fontSize: 16,
      },
      h6: {
        fontFamily: "'MedievalSharp', cursive",
        fontSize: 14,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: "'MedievalSharp', cursive", // Apply to buttons as well
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
    },
  };
};

// Context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark"); // Default to dark mode for the flame aesthetic
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
