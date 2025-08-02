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
    bgcolor: theme.palette.background.paper, // CORRECT: Already using the theme's paper color.
    borderRadius: 3,
    // --- Updated to match the "Volcanic" theme ---
    border: `3px solid ${theme.palette.primary.dark}`,
    boxShadow: `0px 0px 10px 2px ${theme.palette.shadow.main}`,
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
            height: "100%",
            width: "100%",
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
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Box for Sidebar */}
            <Box
              sx={{
                // TODO: make the sidebar a sandwhich dropdown on medium and smalle screens
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
                height: { xs: "auto", md: "100%" },
                width: "100%",
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
                  flex: 1, // <-- Makes this Box grow to fill the remaining vertical space.
                  display: "flex", // <-- Turns this Box into a flex container for its children.
                  flexDirection: "column", // <-- Ensures its children (like HomePageUI) stack normally.
                  overflowY: "auto", // Keep this for scrolling.
                  bgcolor: theme.palette.primary.dark,
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
