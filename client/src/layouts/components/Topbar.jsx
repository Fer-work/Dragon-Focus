import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import useUser from "../../globalHooks/useUser"; // To get user info
import { ColorModeContext } from "../../themes/themeManager.js"; // To get the color mode toggle
import { useLocation } from "react-router-dom";

// Optional: Icons for theme toggle
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Topbar = () => {
  const { user } = useUser(); // Get the authenticated user
  const theme = useTheme();
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);

  const [quotes, setQuotes] = useState([]); // Store all quotes
  const [currentQuote, setCurrentQuote] = useState(null); // Store the single quote to display

  // Function to get the title based on the current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        // "Forge" is a strong, action-oriented word. The fire adds to the theme.
        return "🔥 The Focus Forge 🔥";
      case "/stats":
        // Frames the user's stats not as data, but as a record of their achievements.
        return "📜 Scroll of Achievements 📜";
      case "/settings":
        // Makes settings feel like a valuable, personal collection of tools and themes.
        return "⚙️ Dragon's Settings ⚙️";
      case "/about":
        // Presents the story of the app as an epic tale.
        return "🐲 The Dragon's Saga 🐲";
      case "/dragonlibrary":
        // Enhances the already great title with a classic library/wisdom emoji.
        return "📚 The Dragon's Library �";
      default:
        // A safe and solid fallback.
        return "Dragon Focus";
    }
  };

  const pageTitle = getPageTitle();

  // Fetch quotes on component mount
  useEffect(() => {
    fetch("/data/quotes.json") // Path relative to the public folder
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setQuotes(data);
          // Set an initial random quote once data is loaded
          setCurrentQuote(data[Math.floor(Math.random() * data.length)]);
        } else {
          console.warn(
            "No quotes found or data is not an array in quotes.json. Displaying default quote."
          );
          setQuotes([]); // Ensure quotes is an array
          setCurrentQuote({
            text: "Focus on your breath, center your mind.",
            author: "Dragon Wisdom", // Updated author
          }); // Default fallback quote
        }
      })
      .catch((err) => {
        console.error("Error loading quotes.json:", err);
        setCurrentQuote({
          text: "The journey of a thousand miles begins with a single step.",
          author: "Dragon Wisdom",
        }); // Fallback quote on error
      });
  }, []); // Empty dependency array means this runs once on mount

  return (
    // Outermost container for the Topbar component
    <Box
      sx={{
        width: "100%",
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
        {/* <Box sx={{ flex: 1, textAlign: "left", pl: { xs: 1, sm: 2 } }}>
          {user ? (
            <Typography
              variant="body2"
              sx={{
                // For Quetzal Mode (light), use a darker, readable color
                color:
                  theme.palette.mode === "dark"
                    ? "accent.main"
                    : "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: { xs: "80px", sm: "120px", md: "180px" },
                display: { xs: "none", sm: "block" },
              }}
            >
              {user.email}
            </Typography>
          ) : (
            <Box sx={{ minWidth: { xs: "36px", sm: "48px" } }} />
          )}
        </Box> */}

        {/* Center Element: Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            // For Quetzal Mode (light), use primary green for title
            color: theme.palette.accent.main,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
            mb: 3,
            mx: { xs: 0.5, sm: 1 },
            fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
            textShadow: `2px 2px 4px ${theme.palette.primary.main}`,
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
          {/* Consider Quetzal-themed emojis for light mode if desired */}
        </Typography>

        {/* Right Element: Theme Toggle */}
        {/* <Box sx={{ flex: 1, textAlign: "right", pr: { xs: 1, sm: 2 } }}>
          <IconButton
            onClick={colorMode.toggleColorMode}
            color="inherit"
            aria-label="toggle dark light theme"
            size="medium"
          >
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon
                sx={{
                  color: "accent.main", // Gold icon for light mode button (on dark bg)
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                }}
              />
            ) : (
              <DarkModeOutlinedIcon
                sx={{
                  // For Quetzal Mode (light), use a dark icon
                  color: "primary.dark", // Dark green icon for dark mode button (on light bg)
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                }}
              />
            )}
          </IconButton>
        </Box> */}
      </Box>

      {/* Second Row: Motivational Quote */}
      {currentQuote && (
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: "text.secondary", // This should be a dark gray/charcoal in light mode
            display: { xs: "none", md: "block" },
            mt: 0.5,
            px: 2,
            fontStyle: "italic",
            maxWidth: "75%",
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            lineHeight: 1.4,
          }}
        >
          "{currentQuote.text}" ~{currentQuote.author}
        </Typography>
      )}
    </Box>
  );
};

export default Topbar;
