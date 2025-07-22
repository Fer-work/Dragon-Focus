import { Box, Typography, IconButton } from "@mui/material";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        my: "auto",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Typography
        variant="h1" // As per your preference
        component="h1" // SEO
        sx={{
          color: "accent.main",
          fontWeight: "bold",
          m: 1, // Small margin top to separate from the title line
          p: 2, // Padding to prevent text from touching edges if it wraps
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, // Responsive font size for title
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        Page Not Found
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "text.secondary",
          display: { xs: "none", md: "block" }, // Hide on small screens, show on medium and up
          m: 1, // Small margin top to separate from the title line
          p: 2, // Padding to prevent text from touching edges if it wraps
          fontStyle: "italic", // Add a bit of style to the quote
          maxWidth: "80%", // Prevent quote from being too wide
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        The link you followed to get here must be broken...
      </Typography>
    </Box>
  );
}
