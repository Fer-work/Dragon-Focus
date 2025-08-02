import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens inspired by the flame gradient (dark) and Quetzalcoatl (light)
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        // Dark Mode Palette - Infused with Flame Gradient
        neutral: {
          100: "#F5F2F0", // Bone White (Main Text)
          200: "#D1CBCB", // Light Ash (Secondary Text)
          300: "#A09A9A", // Medium Ash (Subtle Borders)
          400: "#7B7373", // Dark Ash (Dividers)
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
          600: "#e6ac00", // Darker Gold for pressed states
          700: "#cc9700",
          800: "#b38200",
          900: "#996f00",
        },
        error: { main: "#D73737" },
        warning: { main: "#ff8c00" },
        info: { main: "#61AFFE" },
        success: { main: "#ffd700" },
      }
    : {
        // Light Mode Palette - "Vibrant Quetzal Mode"
        // --- REVISED NEUTRAL PALETTE ---
        // Inspired by misty stone and deep jungle shadows for a natural feel.
        neutral: {
          100: "#FCFEFD", // Misty White (Page Background)
          200: "#F0F4F3", // Pale Jade (Paper/Card Background)
          300: "#E1E8E7", // Wet Stone
          400: "#B7C1BF", // Stone Gray (Borders/Dividers)
          500: "#8D9A98", // Damp Earth
          600: "#62706E", // Shadowed Rock
          700: "#434F4D", // Deep Jungle (Secondary Text)
          800: "#2A3331", // Rich Loam
          900: "#1B2120", // Obsidian-Green (Main Text)
        },
        // --- UNCHANGED PRIMARY (Jungle Emerald) ---
        primary: {
          100: "#e0f2e3",
          200: "#c2e5c8",
          300: "#a3d8ad",
          400: "#66bb6a",
          500: "#1e5128", // Main Jungle Green
          600: "#15421f",
          700: "#0c3315",
          800: "#05240c",
          900: "#001503",
        },
        // --- UNCHANGED SECONDARY (Quetzal Turquoise) ---
        secondary: {
          100: "#dff7f5",
          200: "#bff0ec",
          300: "#9fe8e2",
          400: "#40c5b8",
          500: "#00a896", // Main Turquoise
          600: "#008a7c",
          700: "#006c62",
          800: "#004e48",
          900: "#002f2e",
        },

        // --- REVISED ACCENT (Coatl Red & Solar Gold) ---
        // A new ramp centered on the bold red of Quetzalcoatl, with orange/gold as highlights.
        accent: {
          100: "#fff8e1", // Pale Gold (for glows)
          200: "#ffc107", // Solar Gold
          300: "#ff8f33", // Sacred Orange
          400: "#e85d4a", // Scarlet (transition from red to orange)
          500: "#d72638", // Coatl Red (The MAIN Accent Color)
          600: "#c1222f", // Deep Red (for pressed states)
          700: "#a91d29", // Blood Red
          800: "#8b1822", // Sacrificial Red
          900: "#681219", // Darkest Red
        },
        error: { main: "#d32f2f" }, // Standard dark red for errors
        warning: { main: "#ff8f33" }, // Use Sacred Fire Orange for warnings
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
        ...colors.primary,
        main: mode === "dark" ? colors.primary[500] : colors.secondary[500],
        light: mode === "dark" ? colors.primary[300] : colors.primary[400],
        dark: mode === "dark" ? colors.primary[700] : colors.accent[200],
        contrastText:
          mode === "light" ? colors.neutral[100] : colors.neutral[900], // Light mode: White text on "Jungle Green". Dark mode: Dark text on "Dragon's Fire" orange.
      },
      secondary: {
        ...colors.secondary,
        main: colors.secondary[500],
        light: colors.secondary[300],
        dark: colors.secondary[700],
        // REVISED: contrastText logic for both themes.
        contrastText:
          mode === "light" ? colors.neutral[900] : colors.neutral[100], // Light mode: Dark text on "Quetzal Turquoise". Dark mode: Light text on "Earthy Brown".
      },
      neutral: {
        ...colors.neutral,
      },
      shadow: {
        main: mode === "dark" ? colors.primary[500] : colors.accent[800],
        light: mode === "dark" ? colors.primary[300] : colors.neutral[900],
        dark: mode === "dark" ? colors.primary[700] : colors.accent[200],
        contrastText:
          mode === "light" ? colors.neutral[100] : colors.neutral[900], // Light mode: White text on "Jungle Green". Dark mode: Dark text on "Dragon's Fire" orange.
      },
      // REVISED: The accent object is now simplified and more powerful.
      accent: {
        ...colors.accent,
        main: colors.accent[500], // Dark: "Dragon's Gold", Light: "Coatl Red"
        light: colors.accent[300],
        dark: colors.accent[700],
      },
      background: {
        // REVISED: Mapped to our new thematic background colors.
        default: mode === "dark" ? colors.neutral[800] : colors.neutral[600], // Dark: "Deep Charcoal", Light: "Misty White"
        paper: mode === "dark" ? colors.neutral[600] : colors.neutral[500], // Dark: "Charcoal", Light: "Pale Jade"
      },
      text: {
        // REVISED: Mapped to our new thematic text colors for optimal contrast.
        primary: mode === "dark" ? colors.neutral[100] : colors.neutral[900], // Dark: "Bone White", Light: "Obsidian-Green"
        secondary: mode === "dark" ? colors.neutral[200] : colors.neutral[700], // Dark: "Light Ash", Light: "Deep Jungle"
        disabled: mode === "dark" ? colors.neutral[400] : colors.neutral[500],
        accent: colors.accent[500], // Directly uses the main accent color for each mode.
      },
      // REVISED: Semantic colors now have mode-aware contrastText for consistency.
      error: {
        main: colors.error.main,
        contrastText: "#fff", // White text is best for these reds in both modes.
      },
      warning: {
        main: colors.warning.main,
        contrastText: mode === "light" ? colors.neutral[900] : "#000", // Dark text on orange/gold warnings.
      },
      info: {
        main: colors.info.main,
        contrastText: "#fff", // White text works best for these blues.
      },
      success: {
        main: colors.success.main,
        // Dark mode success is gold (needs dark text), light mode success is dark green (needs light text).
        contrastText:
          mode === "dark" ? colors.neutral[900] : colors.neutral[100],
      },
      // REVISED: Divider color is now derived from the palette for thematic consistency.
      divider: colors.accent[500], // Based on Bone White and Obsidian-Green
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
      // UPDATED: AppBar and Paper overrides now point to our new background colors.
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.neutral[700], // Uses "Charcoal" for dark and should be transparent/part of paper for light.
            backgroundImage: "none", // Good practice to disable default gradients.
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            // This ensures Paper components in light mode use our "Pale Jade" background.
            backgroundColor:
              mode === "light" ? colors.neutral[200] : colors.neutral[700], // Dark: "Charcoal"
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
