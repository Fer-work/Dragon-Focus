import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Box, Fade } from "@mui/material";
import { SettingsProvider } from "./utils/SettingsContext.jsx"; // Import the provider
import { useState, useEffect } from "react";

export default function Layout() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SettingsProvider>
      <Fade in={loaded} timeout={700}>
        {/* Wrap the content with the provider */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100%",
            height: "100%",
            py: { xs: 1, sm: 2 },
          }}
        >
          {/* Box for App */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "95vw",
              maxWidth: "1600px", // Max width for the entire app layout
              height: { xs: "auto", md: "90vh" }, // Full height on md+, auto on xs
              maxHeight: { xs: "none", md: "1200px" },
              gap: { xs: 1, sm: 2 },
              // Optional: if you want a slight visual distinction for this container itself
              // bgcolor: (theme) =>
              //   theme.palette.mode === "dark"
              //     ? theme.palette.neutral[800]
              //     : theme.palette.neutral[150], // A slightly different shade
              // borderRadius: 3, // If adding a distinct background
              // boxShadow: "0px 8px 20px rgba(0,0,0,0.1)", // If adding a distinct background
            }}
          >
            {/* Box for Sidebar */}
            <Box
              sx={{
                width: { xs: "100%", md: "20%", lg: "18%" },
                minWidth: { md: "280px" },
                height: { xs: "auto", md: "100%" },
                bgcolor: "background.paper",
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.25)",
                border: (theme) =>
                  `2px solid ${
                    theme.palette.neutral[
                      theme.palette.mode === "dark" ? 500 : 300
                    ]
                  }`,
                display: "flex",
                flexDirection: "column",
                position: { md: "sticky" },
              }}
            >
              <Sidebar />
            </Box>

            {/* Main Content */}
            <Box
              sx={{
                flexGrow: 1,
                height: { xs: "auto", md: "100%" },
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.25)",
                border: (theme) =>
                  `2px solid ${
                    theme.palette.neutral[
                      theme.palette.mode === "dark" ? 500 : 300
                    ]
                  }`,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {/* Box for Topbar */}
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  // Optional: Add a bottom border to separate Topbar from Outlet content
                  borderBottom: (theme) =>
                    `2px solid ${
                      theme.palette.neutral[
                        theme.palette.mode === "dark" ? 700 : 200
                      ]
                    }`,

                  bgcolor: (theme) =>
                    theme.palette.neutral[
                      theme.palette.mode === "dark" ? 700 : 100
                    ], // Slightly different bg for topbar

                  mb: 2,
                }}
              >
                <Topbar />
              </Box>

              {/* Box for Outlet (page content) */}
              <Box
                sx={{
                  flexGrow: 1, // Allows this box to take available vertical space
                  p: 1, // Padding for the page content
                  overflowY: "auto", // Ensure content within Outlet can scroll if needed
                  bgcolor: (theme) =>
                    theme.palette.neutral[
                      theme.palette.mode === "dark" ? 700 : 100
                    ], // S
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
