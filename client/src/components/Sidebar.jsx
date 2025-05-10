import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "../utils/useUser";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";

export default function Sidebar() {
  const { isLoading, user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(getAuth())
      .then(() => navigate("/"))
      .catch((error) => console.error("Sign out error:", error));
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "30%" },
        height: "100%",
        p: 3,
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: 2,
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <Typography variant="h5" align="center" gutterBottom>
        Dragon Focus
      </Typography>

      {/* Navigation */}
      <Stack spacing={2} flexGrow={1}>
        <Button
          component={Link}
          to="/"
          variant="text"
          color="primary"
          sx={{ justifyContent: "flex-start" }}
        >
          Home
        </Button>

        {isLoading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : user ? (
          <>
            <Button
              component={Link}
              to="/stats"
              variant="text"
              color="primary"
              sx={{ justifyContent: "flex-start" }}
            >
              Stats
            </Button>
            <Button
              component={Link}
              to="/settings"
              variant="text"
              color="primary"
              sx={{ justifyContent: "flex-start" }}
            >
              Settings
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        )}
      </Stack>

      {/* Footer */}
      {user && (
        <>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            fullWidth
          >
            Logout
          </Button>
        </>
      )}
    </Box>
  );
}
