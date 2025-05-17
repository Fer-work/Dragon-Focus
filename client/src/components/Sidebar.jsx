import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "../utils/useUser";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  CircularProgress,
  useTheme, // Import useTheme
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Sidebar() {
  const { isLoading, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme(); // Get the theme object

  const handleLogout = () => {
    signOut(getAuth())
      .then(() => navigate("/"))
      .catch((error) => console.error("Sign out error:", error));
  };

  const navButtonStyles = (path) => ({
    justifyContent: "flex-start", // Corrected: flex-start
    textAlign: "left",
    padding: "10px 16px",
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: location.pathname === path ? "bold" : 600,
    color:
      location.pathname === path
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    backgroundColor:
      location.pathname === path
        ? theme.palette.action.selected
        : "transparent",
    "&:hover": {
      color: theme.palette.primary.light, // Use a specific theme color like primary.light or accent.main
      backgroundColor: theme.palette.action.hover,
    },
  });

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Section: Title and navigation */}
      <Box>
        {/* Header */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            pt: 2,
            pb: 1,
            fontFamily: "'MedievalSharp', cursive",
          }}
        >
          Dragon Focus
        </Typography>
      </Box>

      <Divider
        sx={{
          my: 1,
          // Use a specific shade from your neutral palette, or MUI's default 'divider' color
          borderColor: theme.palette.divider, // MUI's default, which is mode-aware
          // Or, for more control:
          // borderColor: theme.palette.mode === 'dark' ? theme.palette.neutral[600] : theme.palette.neutral[300],
        }}
      />

      {/* Navigation */}
      <Stack
        spacing={1.5}
        sx={{
          mt: 2,
          px: 1,
          flexGrow: 1 /* Allow stack to take available space */,
        }}
      >
        <Button
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
          sx={navButtonStyles("/")}
        >
          Home
        </Button>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} color="secondary" />
          </Box>
        ) : user ? (
          <>
            <Button
              component={Link}
              to="/stats"
              startIcon={<BarChartIcon />}
              sx={navButtonStyles("/stats")}
            >
              Stats
            </Button>
            <Button
              component={Link}
              to="/settings"
              startIcon={<SettingsIcon />}
              sx={navButtonStyles("/settings")}
            >
              Settings
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{
              m: 1,
              bgcolor: "primary.main",
              // For text color on primary button, ensure high contrast
              color: theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Sign In
          </Button>
        )}
      </Stack>

      {/* Footer */}
      {user && (
        <Box
          sx={{
            px: 1,
            pb: 2,
            mt: "auto" /* Push to bottom if Stack doesn't fill */,
          }}
        >
          <Divider
            sx={{
              my: 1,
              borderColor: theme.palette.divider,
              // Or:
              // borderColor: theme.palette.mode === 'dark' ? theme.palette.neutral[600] : theme.palette.neutral[300],
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />} // Added icon
            onClick={handleLogout}
            fullWidth
            sx={{
              bgcolor: "secondary.main",
              // For text color on secondary button, ensure high contrast
              color: theme.palette.getContrastText(
                theme.palette.secondary.main
              ),
              "&:hover": {
                bgcolor: "secondary.dark",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}
