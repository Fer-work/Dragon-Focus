import { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"; // Added updateProfile
import axios from "axios"; // To sync user with your backend
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import { ColorModeContext } from "../theme";
import useUser from "../utils/useUser"; // To get the ID token after creation

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [username, setUsername] = useState(''); // Optional: if you want to collect username on signup
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  // const { user: firebaseUserHook } = useUser(); // To get token after creation

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    // Add more password strength validation if desired

    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Optional: Update Firebase profile with a display name if you collect it
      // if (username) {
      //   await updateProfile(firebaseUser, { displayName: username });
      // }

      // After successful Firebase account creation, sync with your backend's /api/users
      // This ensures a user document is created in your MongoDB
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await axios.post(
          "/api/users",
          {
            email: firebaseUser.email,
            // username: username || firebaseUser.displayName, // Send username if collected
          },
          { headers: { authtoken: token } }
        );
      }

      // Navigate to home page after successful account creation and backend sync
      navigate("/"); // Navigate to root
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use. Please try another.");
      } else if (err.code === "auth/weak-password") {
        setError(
          "Password is too weak. Please choose a stronger password (at least 6 characters)."
        );
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to create account. Please try again later.");
      }
      console.error("Create account error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
          borderRadius: 3,
          border: `1px solid ${
            theme.palette.neutral[theme.palette.mode === "dark" ? 600 : 300]
          }`,
        }}
      >
        <Typography
          component="h1"
          variant="h3"
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
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleCreateAccount}
          sx={{ width: "100%" }}
        >
          {/* Optional: Username field
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username (Optional)"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            sx={{
              '& label.Mui-focused': { color: 'primary.light' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          /> */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email-create" // Unique ID
            label="Email Address"
            name="email"
            autoComplete="email"
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
            label="Password (min. 6 characters)"
            type="password"
            id="password-create" // Unique ID
            autoComplete="new-password"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            color="primary"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontWeight: "bold",
              color: theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <MuiLink
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{
                color: "accent.main",
                "&:hover": { color: "accent.light" },
              }}
            >
              Already have an account? Log in
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAccountPage;
