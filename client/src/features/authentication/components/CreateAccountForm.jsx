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
import { Link as RouterLink } from "react-router-dom";

const CreateAccountForm = ({
  formValues,
  onFormChange,
  onSubmit,
  isLoading,
  error,
}) => {
  const theme = useTheme();

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
          // REVISED: Using the theme's divider color for a consistent border.
          border: `1px solid ${theme.palette.divider}`,
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

        <Box component="form" onSubmit={onSubmit} sx={{ width: "100%" }}>
          {/* REVISED: All sx props have been removed from the TextFields. */}
          {/* The global MuiOutlinedInput style in theme.js handles all styling automatically. */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formValues.username}
            onChange={onFormChange}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email-create"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formValues.email}
            onChange={onFormChange}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password (min. 6 characters)"
            type="password"
            id="password-create"
            autoComplete="new-password"
            value={formValues.password}
            onChange={onFormChange}
            disabled={isLoading}
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
            value={formValues.confirmPassword}
            onChange={onFormChange}
            disabled={isLoading}
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
              // REVISED: The color and hover styles are now handled by the theme
              // when using `variant="contained"` and `color="primary"`.
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

export default CreateAccountForm;
