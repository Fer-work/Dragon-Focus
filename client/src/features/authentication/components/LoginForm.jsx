import { ColorModeContext } from "../../../theme";
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
import { Link as RouterLink } from "react-router-dom";

const LoginForm = ({
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

        <Box component="form" onSubmit={onSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formValues.email}
            onChange={onFormChange}
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
            value={formValues.password}
            onChange={onFormChange}
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
export default LoginForm;
