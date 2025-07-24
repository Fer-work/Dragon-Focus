import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Box, Fade, useTheme } from "@mui/material";
import { SettingsProvider } from "../features/settings/hooks/SettingsContext";
import { useState, useEffect } from "react";

export default function Layout() {
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme(); // We'll use this to define our shared styles.

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // --- REFACTOR 1: Define shared panel styles in one place ---
  // This object contains all the presentational styles for our main panels.
  const panelStyles = {
    bgcolor: "background.paper", // CORRECT: Already using the theme's paper color.
    borderRadius: 3,
    // REVISED: Using the theme's shadow ramp instead of a hardcoded value.
    // This makes the shadow consistent with other MUI components like Modal.
    boxShadow: theme.shadows[5],
    // REVISED: Using the theme's dedicated 'divider' color. This is much cleaner
    // and semantically correct. It pulls the transparent color we defined in theme.js.
    border: `2px solid ${theme.palette.divider}`,
  };

  return (
    <SettingsProvider>
      <Fade in={loaded} timeout={700}>
        {/* Outermost container - This is clean, no changes needed */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100vw",
            py: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Box for App - This is clean, no changes needed */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "95vw",
              height: { xs: "auto", md: "90vh" },
              maxHeight: { xs: "none", md: "1200px" },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Box for Sidebar */}
            <Box
              sx={{
                width: { xs: "100%", md: "20%", lg: "18%" },
                minWidth: { md: "280px" },
                height: { xs: "auto", md: "100%" },
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                flexDirection: "column",
                // --- REFACTOR 2: Apply the shared panel styles ---
                ...panelStyles,
              }}
            >
              <Sidebar />
            </Box>

            {/* Main Content Area (Topbar + Outlet) */}
            <Box
              sx={{
                flexGrow: 1,
                height: { xs: "auto", md: "100%" },
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden",
                // --- REFACTOR 2: Apply the shared panel styles ---
                ...panelStyles,
              }}
            >
              {/* Box for Topbar */}
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  // REVISED: Using theme.palette.divider for the internal border.
                  // It's cleaner and more consistent. I've used 1px as is common
                  // for dividers, but you can change it back to 2px if you prefer.
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  mb: 2,
                }}
              >
                <Topbar />
              </Box>

              {/* Box for Outlet (page content) - This is clean, no changes needed */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </SettingsProvider>
  );
}
