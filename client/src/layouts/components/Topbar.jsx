import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import useUser from "../../utils/useUser"; // To get user info
import { ColorModeContext } from "../../theme"; // To get the color mode toggle

// Optional: Icons for theme toggle
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Topbar = () => {
  const { user } = useUser(); // Get the authenticated user
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [quotes, setQuotes] = useState([]); // Store all quotes
  const [currentQuote, setCurrentQuote] = useState(null); // Store the single quote to display

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
            author: "Quetzal Dragon", // Updated author
          }); // Default fallback quote
        }
      })
      .catch((err) => {
        console.error("Error loading quotes.json:", err);
        setCurrentQuote({
          text: "The journey of a thousand miles begins with a single step.",
          author: "Lao Tzu",
        }); // Fallback quote on error
      });
  }, []); // Empty dependency array means this runs once on mount

  return (
    // Outermost container for the Topbar component
    <Box
      sx={{
        width: "100%",
        py: 1, // Vertical padding for the entire Topbar
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center items horizontally in the column
        // bgcolor will be inherited from Layout.jsx's Topbar container
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
        </Box>

        {/* Center Element: Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            // For Quetzal Mode (light), use primary green for title
            color:
              theme.palette.mode === "dark" ? "accent.main" : "primary.main",
            fontWeight: "bold",
            textAlign: "center",
            flexGrow: 1,
            mx: { xs: 0.5, sm: 1 },
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
            lineHeight: 1.2,
          }}
        >
          🔥 Dragon Focus 🔥{" "}
          {/* Consider Quetzal-themed emojis for light mode if desired */}
        </Typography>

        {/* Right Element: Theme Toggle */}
        <Box sx={{ flex: 1, textAlign: "right", pr: { xs: 1, sm: 2 } }}>
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
        </Box>
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
          "{currentQuote.text}"
          {currentQuote.author &&
            currentQuote.author !== "Quetzal Dragon" && // Updated alias
            currentQuote.author !== "Dragon Wisdom" && // Kept for older quotes
            currentQuote.author !== "Lao Tzu" && // Example of specific external author
            currentQuote.author !== "Bobby Knight (adapted)" &&
            currentQuote.author !== "Cal Newport (adapted)" &&
            currentQuote.author !== "Inspired by Jim Kwik" &&
            currentQuote.author !== "Inspired by Learning How to Learn" &&
            currentQuote.author !== "Inspired by Atomic Habits" &&
            currentQuote.author !== "Inspired by The Power of Habit" &&
            currentQuote.author !== "Inspired by Buddhist Principles" &&
            currentQuote.author !== "Inspired by Anthropology/Philosophy" &&
            currentQuote.author !== "Inspired by Gaming" &&
            currentQuote.author !== "Uncle Iroh" && ( // Only show your alias or truly external authors
              <em> - {currentQuote.author}</em>
            )}
        </Typography>
      )}
    </Box>
  );
};

export default Topbar;
