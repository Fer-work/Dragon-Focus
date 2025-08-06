// src/themes/fireTheme.js
import { createTheme } from "@mui/material";

import flameBackground from "../assets/images/backgrounds/flameBackground.png";

// // 1. Define the color tokens for THIS theme only.
export const fireTokens = {
  // Fire Mode Palette - Infused with Flame Gradient
  neutral: {
    100: "#F5F2F0", // Bone White (Main Text)
    200: "#D1CBCB", // Light Ash (Secondary Text)
    300: "#A09A9A", // Medium Ash (Subtle Borders)
    400: "#7B7373", // Fire Ash (Dividers)
    500: "#544C4C", // Warm Stone
    600: "#2D2828", // Soot (Cards/Modals)
    700: "#1C1818", // Charcoal (Main Paper Background)
    800: "#120E0E", // Deep Charcoal (Default Page Background)
    900: "#080404", // Dragon's Shadow (Near Black)
  },

  // --- UNCHANGED PRIMARY PALETTE ---
  // The fire gradient you like, from embers to flame.
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

  // --- UNCHANGED SECONDARY PALETTE ---
  // The earthy/rocky tones that complement the fire.
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

  // --- REVISED ACCENT PALETTE ---
  // Focused on being a single, vibrant "Dragon's Gold" for key highlights.
  accent: {
    100: "#fff8e1", // Lighter Gold for hover/glow
    200: "#ffefb3",
    300: "#ffe580",
    400: "#f5df62",
    500: "#ffd700", // The MAIN Accent Gold
    600: "#e6ac00", // Fireer Gold for pressed states
    700: "#cc9700",
    800: "#b38200",
    900: "#996f00",
  },
  error: { main: "#D73737" },
  warning: { main: "#ff8c00" },
  info: { main: "#61AFFE" },
  success: { main: "#ffd700" },
};

// 2. Create and export the complete MUI theme object.
export const flameTheme = createTheme({
  custom: {
    backgroundImage: flameBackground,
  },
  palette: {
    // CRITICAL FIX: mode must be 'light' or 'dark'
    mode: "dark",
    primary: {
      ...fireTokens.primary,
      main: fireTokens.primary[500],
      light: fireTokens.primary[300],
      dark: fireTokens.primary[700],
      contrastText: fireTokens.neutral[900], //  Fire mode: Fire text on "Dragon's Fire" orange.
    },
    secondary: {
      ...fireTokens.secondary,
      main: fireTokens.secondary[500],
      light: fireTokens.secondary[300],
      dark: fireTokens.secondary[700],
      contrastText: fireTokens.neutral[100], //  Fire mode: Light text on "Earthy Brown".
    },
    neutral: {
      ...fireTokens.neutral,
    },
    // REVISED: The accent object is now simplified and more powerful.
    accent: {
      ...fireTokens.accent,
      main: fireTokens.accent[500], // Fire: "Dragon's Gold", Light: "Coatl Red"
      light: fireTokens.accent[300],
      dark: fireTokens.accent[700],
    },
    background: {
      // REVISED: Mapped to our new thematic background fireTokens.
      default: fireTokens.neutral[800], // Fire: "Deep Charcoal",
      paper: fireTokens.neutral[600], // Fire: "Charcoal"
    },
    text: {
      // REVISED: Mapped to our new thematic text fireTokens for optimal contrast.
      primary: fireTokens.neutral[100], // Fire: "Bone White",
      secondary: fireTokens.neutral[200], // Fire: "Light Ash",
      disabled: fireTokens.neutral[400],
      accent: fireTokens.accent[500], // Directly uses the main accent color for each mode.
    },
    // REVISED: Semantic fireTokens now have mode-aware contrastText for consistency.
    error: {
      main: fireTokens.error.main,
      contrastText: "#fff", // White text is best for these reds in both modes.
    },
    warning: {
      main: fireTokens.warning.main,
      contrastText: "#000", // Fire text on orange/gold warnings.
    },
    info: {
      main: fireTokens.info.main,
      contrastText: "#fff", // White text works best for these blues.
    },
    success: {
      main: fireTokens.success.main,
      // Fire mode success is gold (needs dark text), light mode success is dark green (needs light text).
      contrastText: fireTokens.neutral[900],
    },
    // REVISED: Divider color is now derived from the palette for thematic consistency.
    divider: fireTokens.accent[500], // Based on Bone White and Obsidian-Green
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
    // REVISED: Cleaned up button overrides to rely on the main palette contrastText.
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
    // UPDATED: AppBar and Paper overrides now point to our new background fireTokens.
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: fireTokens.neutral[700], // Uses "Charcoal" for dark and should be transparent/part of paper for light.
          backgroundImage: "none", // Good practice to disable default gradients.
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // This ensures Paper components in light mode use our "Pale Jade" background.
          backgroundColor: fireTokens.neutral[700], // Fire: "Charcoal"
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          // Style for the default border
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.divider, // Use the subtle divider color for the default border
          },
          // Style for the border on hover
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.light,
          },
          // Style for the border on focus - MUI handles this by default using palette.primary.main
          // We don't even need to specify it unless we want to change it.
          "& .MuiSelect-icon": {
            color: theme.palette.secondary.light, // Thematic color for the dropdown arrow
          },
        }),
      },
    },
  },
});
