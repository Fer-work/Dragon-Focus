// src/features/common/TransitionPage.jsx

import { useState, useEffect } from "react"; // Add useEffect
import { useNavigate } from "react-router-dom";
import scrollImage from "../../assets/images/ui/DragonFocusScroll.png";
import {
  Container,
  Box,
  Typography,
  Link as MuiLink,
  useTheme,
} from "@mui/material";

import "../../styles/transition.css";

export default function TransitionPage() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // This will run once, as soon as the component mounts
  useEffect(() => {
    // Start the fade-out a moment after the component mounts
    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);

    // Navigate to the homepage after the animation is complete
    const navTimer = setTimeout(() => {
      navigate("/");
    }, 5000); // Should match your CSS animation duration

    // Cleanup timers if the component unmounts early
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]); // navigate is a dependency of useEffect

  return (
    // You can remove the button if you make it automatic

    <Container
      component="main"
      className={`transition-container ${fadeOut ? "fade-out" : ""}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        py: 4,
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          // For Quetzal Mode (light), use primary green for title
          color: theme.palette.mode === "dark" ? "accent.main" : "primary.main",
          fontWeight: "bold",
          textAlign: "center",
          mx: "auto",
          fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
          lineHeight: 1.2,
        }}
      >
        🔥 Dragon Focus 🔥
        {/* Consider Quetzal-themed emojis for light mode if desired */}
      </Typography>

      <Box
        sx={{
          height: "50%",
          width: "50%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mx: "auto",
        }}
      >
        <img src={scrollImage} alt="Ancient Scroll" className="scroll-image" />
      </Box>
    </Container>
  );
}
