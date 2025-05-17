import { useState, useContext } from "react"; // Added useContext
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link as MuiLink, // For consistent MUI link styling
  useTheme,
} from "@mui/material";
import { ColorModeContext } from "../theme"; // To access toggle if needed, or just useTheme

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      // User state will be updated by onAuthStateChanged listener (used by useUser hook)
      // Navigate to home page after successful login
      navigate("/"); // Navigate to root, which should lead to HomePage
    } catch (err) {
      // Firebase provides specific error codes and messages
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to log in. Please try again later.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs" // Keeps the form nicely contained and centered
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)", // Adjust based on layout's header/footer
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 }, // Responsive padding
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper", // Use paper background from theme
          borderRadius: 3,
          border: `1px solid ${
            theme.palette.neutral[theme.palette.mode === "dark" ? 600 : 300]
          }`,
        }}
      >
        <Typography
          component="h1"
          variant="h3" // Thematic font will apply
          color="primary.main"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Dragon Focus
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Log In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            sx={{
              "& label.Mui-focused": { color: "primary.light" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            sx={{
              "& label.Mui-focused": { color: "primary.light" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary" // Uses primary.main from your theme
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5, // Make button a bit taller
              fontWeight: "bold",
              color: theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Log In"
            )}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <MuiLink
              component={RouterLink}
              to="/create-account"
              variant="body2"
              sx={{
                color: "accent.main",
                "&:hover": { color: "accent.light" },
              }}
            >
              Don't have an account? Create one
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
