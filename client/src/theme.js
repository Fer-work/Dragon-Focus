import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens inspired by the flame gradient (dark) and Quetzalcoatl (light)
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        // Dark Mode Palette - Infused with Flame Gradient (UNCHANGED)
        neutral: {
          100: "#f5df62",
          200: "#ffd700",
          300: "#ccac00",
          400: "#a39a89",
          500: "#3c362a",
          600: "#1E0000",
          700: "#0F0000",
          800: "#050000",
          900: "#000000",
        },
        primary: {
          100: "#fff5e0",
          200: "#f5df62",
          300: "#ffd700",
          400: "#ffa500",
          500: "#ff8c00",
          600: "#cc4e00",
          700: "#972424",
          800: "#660000",
          900: "#330000",
        },
        secondary: {
          100: "#d9c8b8",
          200: "#c0a992",
          300: "#a68b6c",
          400: "#8c6f4f",
          500: "#735738",
          600: "#5f472d",
          700: "#4b3722",
          800: "#382818",
          900: "#24190e",
        },
        accent: {
          100: "#fff8e1",
          200: "#ffefb3",
          300: "#ffe580",
          400: "#f5df62",
          500: "#ffd700",
          600: "#e6ac00",
          700: "#cc9700",
          800: "#b38200",
          900: "#996f00",
        },
        error: { main: "#f44336" },
        warning: { main: "#ffa726" },
        info: { main: "#29b6f6" },
        success: { main: "#66bb6a" },
      }
    : {
        // Light Mode Palette - "Vibrant Quetzal Mode"
        neutral: {
          100: "#fffcf2", // Radiant Light (Background Default)
          200: "#f0f8f0", // Very Pale Green/Off-white (Paper Background - subtle green tint)
          300: "#d0d8d0", // Light Stone Gray
          400: "#b0b8b0", // Medium Stone Gray
          500: "#909890", // Stone Gray
          600: "#5c645f", // Darker Gray-Green (for less important text/borders)
          700: "#2e294e", // Cosmic Indigo (Primary Text)
          800: "#1f1c37", // Darker Indigo
          900: "#100e20", // Very Dark Indigo/Near Black
        },
        primary: {
          // Jungle Emerald / Quetzal Green
          100: "#e0f2e3", // Pale Emerald
          200: "#c2e5c8", // Light Emerald
          300: "#a3d8ad", // Soft Emerald
          400: "#66bb6a", // Medium Emerald (MUI Green 400)
          500: "#1e5128", // Jungle Emerald (Main Primary - from your gradient)
          600: "#15421f", // Darker Jungle Emerald
          700: "#0c3315", // Deep Jungle Emerald
          800: "#05240c", // Very Deep Emerald
          900: "#001503", // Darkest Emerald
        },
        secondary: {
          // Turquoise / Quetzal Feather Blue-Green
          100: "#dff7f5", // Pale Turquoise
          200: "#bff0ec", // Light Turquoise
          300: "#9fe8e2", // Soft Turquoise
          400: "#40c5b8", // Medium Turquoise (Derived from #00a896)
          500: "#00a896", // Turquoise (Main Secondary - from your gradient)
          600: "#008a7c", // Darker Turquoise
          700: "#006c62", // Deep Turquoise
          800: "#004e48", // Very Deep Turquoise
          900: "#002f2e", // Darkest Turquoise
        },
        accent: {
          // Solar Gold & Sacred Fire Orange
          // Gold Ramp
          gold100: "#fff9e0",
          gold200: "#fff3c2",
          gold300: "#ffeda3",
          gold400: "#ffe785",
          gold500: "#fff01f", // Solar Gold (Main Gold Accent - from your gradient)
          gold600: "#e6d81b",
          gold700: "#cca917",
          gold800: "#b38b14",
          gold900: "#996c10",
          // Orange/Red Ramp
          fire100: "#ffebe0",
          fire200: "#ffd8c2",
          fire300: "#ffc5a3",
          fire400: "#ff9d66", // Lighter Sacred Fire (Derived from #ff6f00)
          fire500: "#ff6f00", // Sacred Fire Orange (Main Fire Accent - from your gradient)
          fire600: "#e65a00",
          fire700: "#cc4600",
          // Heart Red (can be a spot accent)
          heartRed: "#d72638", // From your gradient
        },
        error: { main: "#d32f2f" }, // Standard dark red for errors
        warning: { main: "#ff6f00" }, // Use Sacred Fire Orange for warnings
        info: { main: "#028090" }, // Use Quetzal Feather for info
        success: { main: "#1e5128" }, // Use Jungle Emerald for success
      }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      primary: {
        main: colors.primary[500],
        light: colors.primary[300],
        dark: colors.primary[700],
        contrastText:
          mode === "light" ? colors.neutral[100] : colors.neutral[100], // Radiant light for text on dark green, and also on light green for pop
      },
      secondary: {
        main: colors.secondary[500],
        light: colors.secondary[300],
        dark: colors.secondary[700],
        contrastText:
          mode === "light" ? colors.neutral[900] : colors.neutral[100], // Dark indigo text on light turquoise, light text on dark turquoise
      },
      neutral: colors.neutral,
      accent: {
        // Define main accents, others can be accessed via theme.palette.accent.goldXXX etc.
        main: colors.accent.gold500, // Solar Gold as the primary accent
        fire: colors.accent.fire500, // Sacred Fire Orange
        heartRed: colors.accent.heartRed,
        // You can add light/dark variants if needed, e.g.,
        // mainLight: colors.accent.gold300,
        // mainDark: colors.accent.gold700,
      },
      background: {
        default: mode === "dark" ? colors.neutral[700] : colors.neutral[100], // Radiant Light for Quetzal default BG
        paper: mode === "dark" ? colors.neutral[600] : colors.primary[200], // Pale Green/Off-white for Quetzal paper BG
      },
      text: {
        primary: mode === "dark" ? colors.neutral[100] : colors.neutral[700], // Cosmic Indigo for Quetzal primary text
        secondary: mode === "dark" ? colors.neutral[200] : colors.neutral[600], // Darker Gray-Green for Quetzal secondary text
        disabled: mode === "dark" ? colors.neutral[400] : colors.neutral[500],
        // For text that needs to be an accent color (use sparingly)
        accent: mode === "dark" ? colors.accent.gold500 : colors.accent.fire500,
      },
      error: { main: colors.error.main, contrastText: colors.neutral[100] },
      warning: { main: colors.warning.main, contrastText: colors.neutral[900] }, // Dark text on orange
      info: { main: colors.info.main, contrastText: colors.neutral[100] },
      success: { main: colors.success.main, contrastText: colors.neutral[100] },
      divider:
        mode === "dark" ? "rgba(245, 223, 98, 0.2)" : "rgba(46, 41, 78, 0.15)", // Indigo-based divider for light
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
            // Add a subtle shadow to buttons for a more "gamified" feel
            // boxShadow: mode === 'light' ? '0px 2px 4px rgba(46, 41, 78, 0.2)' : '0px 2px 4px rgba(0, 0, 0, 0.3)',
          },
          containedPrimary: {
            color: colors.neutral[100], // Ensure contrast on primary buttons
          },
          containedSecondary: {
            color: colors.neutral[100], // Ensure contrast on secondary buttons
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
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? colors.neutral[200] : undefined,
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
  // 1. Check local storage first, then fall back to 'dark'
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "dark";
  });
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => {
          const newMode = prev === "light" ? "dark" : "light";
          // 2. Save the new choice to local storage
          localStorage.setItem("themeMode", newMode);
          return newMode;
        }),
    }),
    []
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
