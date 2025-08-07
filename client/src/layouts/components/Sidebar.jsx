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
import {
  BarChart,
  Article,
  BookOnlineRounded,
  BookRounded,
} from "@mui/icons-material";
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
          component="h3"
          align="center"
          gutterBottom
          sx={{
            color: theme.palette.primary.light,
            fontWeight: "bold",
            pt: 2,
            pb: 1,
            // REVISED: The fontFamily is already set globally in the theme's
            // typography settings, so this override is redundant.
            // fontFamily: "'MedievalSharp', cursive",
          }}
        >
          🔥 Dragon Focus 🔥
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
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/dragonlibrary"
              startIcon={<BookRounded />}
              sx={{
                justifyContent: "start",
                textAlign: "left",
                p: "16px",
              }}
            >
              Sources
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
