import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { typography } from "@mui/material";

// Color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        base: {
          100: "#d6cccc",
          200: "#ad9999",
          300: "#856666",
          400: "#5c3333",
          500: "#330000",
          600: "#290000",
          700: "#1f0000",
          800: "#140000",
          900: "#0a0000",
        },
        primary: {
          100: "#ead3d3",
          200: "#d5a7a7",
          300: "#c17c7c",
          400: "#ac5050",
          500: "#972424",
          600: "#791d1d",
          700: "#5b1616",
          800: "#3c0e0e",
          900: "#1e0707",
        },
        primary_accent: {
          100: "#f5dccc",
          200: "#ebb899",
          300: "#e09566",
          400: "#d67133",
          500: "#cc4e00",
          600: "#a33e00",
          700: "#7a2f00",
          800: "#521f00",
          900: "#291000",
        },
        secondary: {
          100: "#ffe8cc",
          200: "#ffd199",
          300: "#ffba66",
          400: "#ffa333",
          500: "#ff8c00",
          600: "#cc7000",
          700: "#995400",
          800: "#663800",
          900: "#331c00",
        },
        secondary_accent: {
          100: "#fff7cc",
          200: "#ffef99",
          300: "#ffe766",
          400: "#ffdf33",
          500: "#ffd700",
          600: "#ccac00",
          700: "#998100",
          800: "#665600",
          900: "#332b00",
        },
      }
    : {
        base: {
          900: "#d6cccc",
          800: "#ad9999",
          700: "#856666",
          600: "#5c3333",
          500: "#330000",
          400: "#290000",
          300: "#1f0000",
          200: "#140000",
          100: "#0a0000",
        },
        primary: {
          900: "#ead3d3",
          800: "#d5a7a7",
          700: "#c17c7c",
          600: "#ac5050",
          500: "#972424",
          400: "#791d1d",
          300: "#5b1616",
          200: "#3c0e0e",
          100: "#1e0707",
        },
        primary_accent: {
          900: "#f5dccc",
          800: "#ebb899",
          700: "#e09566",
          600: "#d67133",
          500: "#cc4e00",
          400: "#a33e00",
          300: "#7a2f00",
          200: "#521f00",
          100: "#291000",
        },
        secondary: {
          900: "#ffe8cc",
          800: "#ffd199",
          700: "#ffba66",
          600: "#ffa333",
          500: "#ff8c00",
          400: "#cc7000",
          300: "#995400",
          200: "#663800",
          100: "#331c00",
        },
        secondary_accent: {
          900: "#fff7cc",
          800: "#ffef99",
          700: "#ffe766",
          600: "#ffdf33",
          500: "#ffd700",
          400: "#ccac00",
          300: "#998100",
          200: "#665600",
          100: "#332b00",
        },
      }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.base[700],
              main: colors.base[500],
              light: colors.base[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.base[700],
              main: colors.base[500],
              light: colors.base[100],
            },
            background: {
              default: colors.base[100],
            },
          }),
    },
    typography: {
      fontFamily: ["Jacquard 12", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Jacquard 12", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Jacquard 12", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Jacquard 12", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Jacquard 12", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Jacquard 12", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Jacquard 12", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// Context for color mode
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
