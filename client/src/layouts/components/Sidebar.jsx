import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "../../globalHooks/useUser";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { BarChart, Article, BookSharp } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Sidebar() {
  const { isLoading, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    signOut(getAuth())
      .then(() => navigate("/"))
      .catch((error) => console.error("Sign out error:", error));
  };

  // This function is very well-written and uses theme tokens correctly. No changes needed.
  // const navButtonStyles = () => ({
  //   justifyContent: "flex-start",
  //   textAlign: "left",
  //   padding: "10px 16px",
  //   textTransform: "none",
  // });

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
        <Typography
          variant="h3"
          component="h1" // Using h1 for the main page title is great for SEO
          align="center"
          gutterBottom
          sx={{
            color: theme.palette.primary.light,
            fontWeight: "bold",
            pt: 2,
            pb: 1,
            // We use flexbox on the title itself to easily align the text and the tag
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap", // Allows the tag to wrap on very small screens
            gap: theme.spacing(1.5), // Adds a thematic gap between the title and the tag
          }}
        >
          🔥 Dragon Focus 🔥
          {/* This Box creates the styled "tag" */}
          <Box
            component="span" // Render as a span but with all the styling power of a Box
            sx={{
              fontSize: "0.9rem", // Smaller font size for the tag
              fontWeight: "normal", // Less bold than the main title
              // A thematic color for attention. 'warning' or 'info' are good choices.
              backgroundColor: theme.palette.warning.main,
              // This helper ensures the text color has good contrast with the background
              color: theme.palette.getContrastText(theme.palette.warning.main),
              borderRadius: "6px", // Rounded corners for the tag look
              px: 1.5, // Horizontal padding
              py: 0.5, // Vertical padding
              textTransform: "uppercase", // A common style for tags
              letterSpacing: "0.5px",
              // Ensures the tag aligns nicely with the title text
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            v0.8.2 Beta
          </Box>
        </Typography>
      </Box>

      {/* This Divider is perfect, using the theme's divider color. */}
      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

      {/* Navigation */}
      <Stack spacing={1.5} sx={{ mt: 2, px: 1, flexGrow: 1 }}>
        <Button
          variant="text"
          color="primary"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
          sx={{
            justifyContent: "start",
            textAlign: "left",
            p: "16px",
          }}
        >
          Home
        </Button>
        <Button
          variant="text"
          color="primary"
          component={Link}
          to="/about"
          startIcon={<Article />}
          sx={{
            justifyContent: "start",
            textAlign: "left",
            p: "16px",
          }}
        >
          About
        </Button>
        <Button
          variant="text"
          color="primary"
          component={Link}
          to="/dragonlibrary"
          startIcon={<BookSharp />}
          sx={{
            justifyContent: "start",
            textAlign: "left",
            p: "16px",
          }}
        >
          Sources
        </Button>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} color="secondary" />
          </Box>
        ) : user ? (
          <>
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/stats"
              startIcon={<BarChart />}
              sx={{
                justifyContent: "start",
                textAlign: "left",
                p: "16px",
              }}
            >
              Stats
            </Button>
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/settings"
              startIcon={<SettingsIcon />}
              sx={{
                justifyContent: "start",
                textAlign: "left",
                p: "16px",
              }}
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
              m: 1, // Keep layout-specific styles like margin.
              // REVISED: All of the following properties are now automatically
              // handled by the theme when you set `color="primary"`.
              // bgcolor: "primary.main",
              // color: theme.palette.getContrastText(theme.palette.primary.main),
              // "&:hover": {
              //   bgcolor: "primary.dark",
              // },
            }}
          >
            Sign In
          </Button>
        )}
      </Stack>

      {/* Footer */}
      {user && (
        <Box sx={{ px: 1, pb: 2, mt: "auto" }}>
          <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
          <Button
            variant="contained"
            color="secondary" // This handles everything!
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
            // REVISED: All styling is now handled by the theme when you set `color="secondary"`.
            // The sx prop is no longer needed here.
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}
