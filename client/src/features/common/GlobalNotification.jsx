// src/features/common/GlobalNotification.jsx

import { Box, Typography, Slide, useTheme } from "@mui/material";
import { useNotification } from "../../globalHooks/NotificationContext";

// Import your scroll image
import scrollImage from "../../assets/images/ui/EmptyScroll.png";

// MUI Icons are no longer needed
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ErrorIcon from "@mui/icons-material/Error";
// import InfoIcon from "@mui/icons-material/Info";

const GlobalNotification = () => {
  const { notification, hideNotification } = useNotification();
  const theme = useTheme();

  if (!notification) {
    return null;
  }

  // --- REVISED: Replaced MUI Icons with thematic emojis ---
  const notificationConfig = {
    success: { icon: "🎉", color: theme.palette.success.main },
    error: { icon: "⚠️", color: theme.palette.error.main },
    info: { icon: "ℹ️", color: theme.palette.info.main },
  };

  const { icon, color } =
    notificationConfig[notification.type] || notificationConfig.info;

  return (
    <Slide direction="left" in={!!notification} mountOnEnter unmountOnExit>
      <Box
        onClick={hideNotification}
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          // Kept your updated dimensions
          width: { xs: "280px", sm: "300px", md: "300px" },
          height: { xs: "180px", sm: "200px", md: "300px" },
          backgroundImage: `url(${scrollImage})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // Align content to the top
          alignItems: "center",
          textAlign: "center",
          // Restored refined padding to keep content within the scroll's visual area
          p: {
            xs: "25px 45px 35px 70px",
            sm: "30px 50px 40px 50px",
            md: "30px 50px 70px 70px",
          },
          cursor: "pointer",
          zIndex: theme.zIndex.snackbar,
          color: theme.palette.neutral[800],
        }}
      >
        {/* Header container for emojis and icon */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1, // Margin below the header
          }}
        >
          <Typography sx={{ fontSize: "1.5rem" }}>{icon}</Typography>
          {/* The emoji (now a string) will be rendered here. The color prop will be ignored by most emojis. */}
          <Typography sx={{ fontSize: "1.5rem" }}>{icon}</Typography>

          <Typography sx={{ fontSize: "1.5rem" }}>{icon}</Typography>
        </Box>

        {/* Scrollable Text Container */}
        <Box
          sx={{
            flex: 1,
            width: "60%", // Changed from 70% to fill the available space
            overflowY: "auto",
            // Thematic Scrollbar Styling
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.neutral[400],
              borderRadius: "4px",
              border: `2px solid transparent`,
              backgroundClip: "content-box",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: theme.palette.neutral[500],
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontFamily: "'MedievalSharp', cursive",
              fontSize: "1rem",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {notification.message}
          </Typography>
        </Box>
      </Box>
    </Slide>
  );
};

export default GlobalNotification;
