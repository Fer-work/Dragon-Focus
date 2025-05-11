import { Box, Typography } from "@mui/material";

const Topbar = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        borderRadius: 3,
        padding: 2,
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1" align="center" gutterBottom>
        🔥 Welcome to Dragon Focus! 🔥
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Start tracking your focus progress!
      </Typography>
    </Box>
  );
};

export default Topbar;
