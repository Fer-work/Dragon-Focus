import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens inspired by the flame gradient
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        // Dark Mode Palette - Infused with Flame Gradient
        neutral: {
          // For backgrounds and general text
          100: "#f5df62", // Pale Gold from gradient (Primary Text)
          200: "#ffd700", // Gold from gradient (Secondary Text / Brighter elements)
          300: "#ccac00", // Darker Gold
          400: "#a39a89", // Darker Parchment (like previous neutral)
          500: "#3c362a", // Dark Taupe
          600: "#1E0000", // Dark Red-Black (Paper Background, inspired by gradient's #330000)
          700: "#0F0000", // Very Dark Red-Black (Default Background, inspired by gradient)
          800: "#050000", // Almost Black
          900: "#000000", // Black (from gradient)
        },
        primary: {
          // Core Flame Colors from Gradient
          100: "#fff5e0", // Very Pale Orange/Yellow
          200: "#f5df62", // Pale Gold (from gradient, lightest flame tip)
          300: "#ffd700", // Gold (from gradient)
          400: "#ffa500", // Lighter Orange (from gradient)
          500: "#ff8c00", // Main Orange (from gradient, --flame-orange)
          600: "#cc4e00", // Dark Orange (from gradient)
          700: "#972424", // Muted Red (from gradient)
          800: "#660000", // Dark Red (from gradient)
          900: "#330000", // Very Dark Red (from gradient)
        },
        secondary: {
          // Rich Brown / Leather - to complement flame without competing
          100: "#d9c8b8",
          200: "#c0a992",
          300: "#a68b6c",
          400: "#8c6f4f",
          500: "#735738", // Main Rich Brown
          600: "#5f472d",
          700: "#4b3722",
          800: "#382818",
          900: "#24190e",
        },
        accent: {
          // Brightest highlights - Gold/Yellow from Gradient
          100: "#fff8e1", // Pale Gold
          200: "#ffefb3", // Light Gold
          300: "#ffe580", // Soft Gold
          400: "#f5df62", // Pale Gold (from gradient)
          500: "#ffd700", // Main Gold (from gradient)
          600: "#e6ac00", // Darker Gold
          700: "#cc9700", // Deep Gold
          800: "#b38200", // Antique Gold
          900: "#996f00", // Darkest Gold
        },
        error: { main: "#f44336" },
        warning: { main: "#ffa726" },
        info: { main: "#29b6f6" },
        success: { main: "#66bb6a" },
      }
    : {
        // Light Mode Palette - Harmonious with Flame Tones
        neutral: {
          100: "#fdfcf9", // Very Light Cream (background default)
          200: "#f4f0e9", // Light Cream (paper background)
          300: "#e9e1d6", // Soft Beige
          400: "#ded3c3", // Light Tan
          500: "#c4b8a8", // Tan
          600: "#a39a89", // Medium Taupe
          700: "#660000", // Dark Red from gradient (Primary Text)
          800: "#4c0000", // Deeper Red (Secondary Text)
          900: "#330000", // Very Dark Red from gradient
        },
        primary: {
          // Warm Oranges/Yellows, suitable for light backgrounds
          100: "#fff8e1", // Pale Gold
          200: "#ffefb3", // Light Gold
          300: "#ffe082", // Soft Yellow-Orange
          400: "#ffa500", // Lighter Orange (Good for main actions)
          500: "#ff8c00", // Main Orange (Vibrant)
          600: "#e67352", // Darker Orange
          700: "#cc4e00", // Burnt Orange (Good for text on light if bold)
          800: "#b34b2d",
          900: "#993a1c",
        },
        secondary: {
          // Muted Terracotta or Warm Brown
          100: "#ffebee", // Lightest reddish-brown
          200: "#ffddd9", // Lighter
          300: "#fcc2bb",
          400: "#f8a79e",
          500: "#e57373", // Muted Red / Terracotta (was #d9534f)
          600: "#d35f5f",
          700: "#c24b4b",
          800: "#b03737",
          900: "#9f2323",
        },
        accent: {
          // Gold / Bright Orange
          100: "#fff8e1",
          200: "#ffefb3",
          300: "#ffe580",
          400: "#ffd700", // Main Gold for accents (from gradient)
          500: "#ffc107", // Deeper Gold / Bright Orange
          600: "#e6ac00",
          700: "#cc9700",
          800: "#b38200",
          900: "#996f00",
        },
        error: { main: "#d32f2f" },
        warning: { main: "#f57c00" },
        info: { main: "#0288d1" },
        success: { main: "#388e3c" },
      }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      primary: {
        main: colors.primary[500],
        light: colors.primary[300], // Example: using a lighter shade from your scale
        dark: colors.primary[700], // Example: using a darker shade
      },
      secondary: {
        main: colors.secondary[500],
        light: colors.secondary[300],
        dark: colors.secondary[700],
      },
      neutral: colors.neutral,
      accent: {
        main: colors.accent[500],
        light: colors.accent[300],
        dark: colors.accent[700],
      },
      background: {
        default: mode === "dark" ? colors.neutral[700] : colors.neutral[100],
        paper: mode === "dark" ? colors.neutral[600] : colors.neutral[200],
      },
      text: {
        primary: mode === "dark" ? colors.neutral[100] : colors.neutral[700],
        secondary: mode === "dark" ? colors.neutral[200] : colors.neutral[600], // Adjusted for better contrast
        disabled: mode === "dark" ? colors.neutral[400] : colors.neutral[500],
        accent: colors.accent[mode === "dark" ? 400 : 500], // Using the brighter accents
      },
      error: { main: colors.error.main },
      warning: { main: colors.warning.main },
      info: { main: colors.info.main },
      success: { main: colors.success.main },
    },
    typography: {
      fontFamily: "'MedievalSharp', cursive",
      fontSize: 14,
      h1: { fontFamily: "'MedievalSharp', cursive", fontSize: 40 },
      h2: { fontFamily: "'MedievalSharp', cursive", fontSize: 32 },
      h3: { fontFamily: "'MedievalSharp', cursive", fontSize: 24 },
      h4: { fontFamily: "'MedievalSharp', cursive", fontSize: 20 },
      h5: { fontFamily: "'MedievalSharp', cursive", fontSize: 16 },
      h6: { fontFamily: "'MedievalSharp', cursive", fontSize: 14 },
      button: {
        fontFamily: "'MedievalSharp', cursive",
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: "'MedievalSharp', cursive",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "dark" ? colors.neutral[800] : colors.neutral[200],
          },
        },
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");
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
