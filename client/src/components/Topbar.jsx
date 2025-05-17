import React, { useContext } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import useUser from "../utils/useUser"; // To get user info
import { ColorModeContext } from "../theme"; // To get the color mode toggle

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Topbar = () => {
  const { user } = useUser(); // Get the authenticated user
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const motivationalQuotes = [
    "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    "Focus is a muscle. The more you train it, the stronger it gets.",
    "The successful warrior is the average man, with laser-like focus.",
    "Dragons guard treasure; focus guards productivity.",
    "Unleash your inner dragon: concentrate and conquer.",
    "Every focused session forges a stronger you.",
  ];
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    // Outermost container for the Topbar component
    <Box
      sx={{
        width: "100%",
        py: 1, // Vertical padding for the entire Topbar
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center items horizontally in the column
      }}
    >
      {/* First Row: User Email | Title | Theme Toggle */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center", // Vertically center items in this row
          mb: 0.5, // Small margin bottom before the quote
        }}
      >
        {/* Left Element: User Email or Spacer */}
        <Box sx={{ flex: 1, textAlign: "left", pl: { xs: 1, sm: 2 } }}>
          {user ? (
            <Typography
              variant="body2"
              sx={{
                color: "accent.main",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: { xs: "100px", sm: "150px", md: "200px" }, // Limit width of email display
                display: { xs: "none", sm: "block" }, // Hide email on very small screens if needed
              }}
            >
              {user.email}
            </Typography>
          ) : (
            // Spacer to balance the IconButton on the right when no user is logged in
            // Adjust minWidth to roughly match the width of the IconButton's container
            <Box sx={{ minWidth: { xs: "40px", sm: "48px" } }} />
          )}
        </Box>

        {/* Center Element: Title */}
        <Typography
          variant="h1" // As per your preference
          component="h1" // SEO
          sx={{
            color: "accent.main",
            fontWeight: "bold",
            textAlign: "center", // Ensure text itself is centered
            flexGrow: 1, // Allow title to take up available space in the middle
            mx: { xs: 1, sm: 2 }, // Horizontal margin for breathing room
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, // Responsive font size for title
          }}
        >
          🔥 Dragon Focus 🔥
        </Typography>

        {/* Right Element: Theme Toggle */}
        <Box sx={{ flex: 1, textAlign: "right", pr: { xs: 1, sm: 2 } }}>
          <IconButton
            onClick={colorMode.toggleColorMode}
            color="inherit" // Inherits color from parent, then overridden by sx
            aria-label="toggle dark light theme"
          >
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon
                sx={{
                  color: "accent.main",
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              />
            ) : (
              <DarkModeOutlinedIcon
                sx={{
                  color: theme.palette.neutral[700],
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Second Row: Motivational Quote */}
      <Typography
        variant="h6"
        align="center" // This centers the text block itself
        sx={{
          color: "text.secondary",
          display: { xs: "none", md: "block" }, // Hide on small screens, show on medium and up
          mt: 0.5, // Small margin top to separate from the title line
          px: 2, // Padding to prevent text from touching edges if it wraps
          fontStyle: "italic", // Add a bit of style to the quote
          maxWidth: "80%", // Prevent quote from being too wide
        }}
      >
        {randomQuote}
      </Typography>
    </Box>
  );
};

export default Topbar;
