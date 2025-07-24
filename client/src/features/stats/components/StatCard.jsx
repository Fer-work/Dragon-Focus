import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // To access theme for dynamic styling

const StatCard = ({ title, value, unit, icon, loading, cardColor }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0} // Using custom border/shadow
      sx={{
        p: { xs: 2, sm: 2.5 },
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // REVISED: Simplified background and border logic.
        bgcolor: "background.paper", // Always use the standard paper background.
        border: `1px solid ${theme.palette.divider}`, // Use the standard theme divider.
        borderRadius: 3,
        boxShadow: theme.shadows[3], // Use a standard theme shadow.
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {icon && (
        <Box
          sx={{
            fontSize: "2.5rem",
            // REVISED: Use a consistent color for the icon.
            color: "primary.main",
            mb: 1,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        variant="h6"
        component="h3"
        // REVISED: Use the standard secondary text color for all titles.
        color="text.secondary"
        gutterBottom
        sx={{ fontWeight: "medium" }}
      >
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={30} color="primary" sx={{ mt: 1 }} />
      ) : (
        <Typography
          variant="h3"
          component="p"
          // REVISED: Use a consistent accent color for the main value.
          color="accent.main"
          sx={{ fontWeight: "bold", lineHeight: 1.2 }}
        >
          {typeof value === "number"
            ? value.toFixed(1).replace(".0", "")
            : value || 0}
          {unit && (
            <Typography
              variant="h6"
              component="span"
              // REVISED: Use the standard secondary text color for units.
              color="text.secondary"
              sx={{ ml: 0.5, fontWeight: "normal" }}
            >
              {unit}
            </Typography>
          )}
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;
