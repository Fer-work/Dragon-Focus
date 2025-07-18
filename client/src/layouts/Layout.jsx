import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Box, Fade, useTheme } from "@mui/material";
import { SettingsProvider } from "../utils/SettingsContext.jsx"; // Import the provider
import { useState, useEffect } from "react";

export default function Layout() {
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme(); // Initialize useTheme to access theme object

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100); // Slight delay for fade-in
    return () => clearTimeout(timer);
  }, []);

  // // Define common panel styles to reduce repetition and ensure consistency
  // const panelStyles = {
  //   p: { xs: 1.5, sm: 2 },
  //   borderRadius: 3, // Consistent rounding
  //   // background.paper will be applied, which is Pale Turquoise in Quetzal Mode
  //   bgcolor: "background.paper",
  //   // Add opacity to let the main CSS background image subtly show through
  //   opacity: theme.palette.mode === "light" ? 0.95 : 1, // More opaque for dark mode if needed, or keep consistent
  //   border: `3px solid ${
  //     theme.palette.mode === "dark"
  //       ? theme.palette.neutral[500]
  //       : theme.palette.primary.main
  //   }`, // Dark: Dark Taupe; Light: Jungle Emerald Green
  //   boxShadow:
  //     theme.palette.mode === "dark"
  //       ? "0px 7px 20px rgba(0,0,0,0.4)"
  //       : `0px 7px 20px ${theme.palette.primary.light}33`, // Light: Subtle Jungle Emerald-tinted shadow (hex with alpha)
  //   display: "flex",
  //   flexDirection: "column",
  //   height: { xs: "auto", md: "100%" },
  // };

  return (
    <SettingsProvider>
      <Fade in={loaded} timeout={700}>
        <Box // Outermost container - sets the overall page background
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh", // Ensure it covers the full viewport height
            width: "100vw", // Ensure it covers the full viewport width
            py: { xs: 1, sm: 2, md: 3 }, // Increased padding for better spacing from viewport edges
          }}
        >
          {/* Box for App - the main container for sidebar and content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "95vw",
              height: { xs: "auto", md: "90vh" },
              maxHeight: { xs: "none", md: "1200px" },
              gap: { xs: 2, sm: 3 }, // Increased gap
            }}
          >
            {/* Box for Sidebar */}
            <Box
              sx={{
                width: { xs: "100%", md: "20%", lg: "18%" },
                minWidth: { md: "280px" },
                height: { xs: "auto", md: "100%" },
                bgcolor: "background.paper", // Uses neutral[600] (dark) or neutral[200] (light)
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.25)",
                border: `2px solid ${
                  theme.palette.neutral[
                    theme.palette.mode === "dark" ? 500 : 400
                  ]
                }`, // Dark: Dark Taupe, Light: Medium Stone Gray
                display: "flex",
                flexDirection: "column",
                // position: { md: "sticky" }, // Consider if truly needed with overflowY on parent
                // top: {md: theme.spacing(2)}
              }}
            >
              <Sidebar />
            </Box>

            {/* Main Content Area (Topbar + Outlet) */}
            <Box
              sx={{
                flexGrow: 1,
                height: { xs: "auto", md: "100%" },
                bgcolor: "background.paper", // Uses neutral[600] (dark) or neutral[200] (light)
                borderRadius: 3,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.25)",
                border: `2px solid ${
                  theme.palette.neutral[
                    theme.palette.mode === "dark" ? 500 : 400
                  ]
                }`, // Dark: Dark Taupe, Light: Medium Stone Gray
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden", // Prevent double scrollbars if Outlet handles its own
              }}
            >
              {/* Box for Topbar */}
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderBottom: `2px solid ${
                    theme.palette.neutral[
                      theme.palette.mode === "dark" ? 700 : 300
                    ]
                  }`, // Dark: V.Dark Red-Black, Light: Soft Stone Gray
                  // bgcolor is inherited from parent ("background.paper") - making it consistent
                  mb: 2,
                }}
              >
                <Topbar />
              </Box>

              {/* Box for Outlet (page content) */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  // This ensures HomePage and other pages sit on the neutral[200] (Light Jade/Stone) in light mode
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
