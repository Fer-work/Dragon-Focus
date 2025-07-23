import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // To access theme for dynamic styling

const StatCard = ({ title, value, unit, icon, loading, cardColor }) => {
  const theme = useTheme();

  // Key Change: Consolidated all text color logic into one variable.
  const contentColor = cardColor
    ? theme.palette.getContrastText(theme.palette[cardColor]?.main || cardColor)
    : theme.palette.text.primary;

  // Use a slightly less prominent color for the title, based on the main content color.
  const titleColor = cardColor ? contentColor : theme.palette.text.secondary;

  return (
    <Paper
      elevation={4} // Slightly more elevation
      sx={{
        p: { xs: 2, sm: 2.5 }, // Responsive padding
        textAlign: "center",
        height: "100%", // Ensure cards in a row have same height if in a Grid
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: cardColor ? `${cardColor}.light` : "background.paper", // Use a light variant of the cardColor or default paper
        border: `1px solid ${
          cardColor
            ? `${cardColor}.main`
            : theme.palette.neutral[theme.palette.mode === "dark" ? 500 : 300]
        }`,
        borderRadius: 3, // Match other rounded corners
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
            color: cardColor ? contentColor : "primary.main",
            mb: 1,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        variant="h6"
        component="h3" // More semantic heading for a card title
        color={titleColor}
        gutterBottom
        sx={{ fontWeight: "medium" }}
      >
        {title}
      </Typography>
      {loading ? (
        <CircularProgress
          size={30}
          color={cardColor || "primary"}
          sx={{ mt: 1 }}
        />
      ) : (
        <Typography
          variant="h3" // Larger for the main value
          component="p"
          color={cardColor ? contentColor : "primary.main"}
          sx={{ fontWeight: "bold", lineHeight: 1.2 }} // Adjust line height
        >
          {typeof value === "number"
            ? value.toFixed(1).replace(".0", "")
            : value || 0}
          {unit && (
            <Typography
              variant="h6" // Make unit slightly smaller than value
              component="span"
              color={titleColor}
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
