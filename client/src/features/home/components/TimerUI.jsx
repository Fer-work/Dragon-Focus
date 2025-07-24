import {
  Box,
  Button,
  Typography,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

// Optional: Icons for buttons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import TimerIcon from "@mui/icons-material/Timer"; // For Pomodoro
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast"; // For Breaks

const TimerUI = ({
  timeLeft,
  isRunning,
  currentSession,
  isTimerDisabled,
  onToggle,
  onReset,
  onChangeSession,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* REVISED: Using ToggleButtonGroup for cleaner, semantic session selection */}
      <ToggleButtonGroup
        value={currentSession}
        exclusive
        onChange={(event, newSession) => {
          if (newSession !== null) {
            // Prevent unselecting all
            onChangeSession(newSession);
          }
        }}
        aria-label="session type"
        fullWidth
        sx={{ mb: 3 }}
        disabled={isRunning || isTimerDisabled}
        color="primary" // This color will be applied to the selected button
      >
        <ToggleButton value="pomodoro" aria-label="pomodoro session">
          <TimerIcon sx={{ mr: 1 }} />
          Pomodoro
        </ToggleButton>
        <ToggleButton value="shortBreak" aria-label="short break session">
          <FreeBreakfastIcon sx={{ mr: 1 }} />
          Short Break
        </ToggleButton>
        <ToggleButton value="longBreak" aria-label="long break session">
          <FreeBreakfastIcon sx={{ mr: 1 }} />
          Long Break
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Timer Display */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "240px", sm: "300px", md: "360px" }, // Slightly adjusted for potentially larger digits
          height: { xs: "240px", sm: "300px", md: "360px" },
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.neutral[900] // Very Dark (almost black)
              : theme.palette.neutral[100], // Very Light Jade/Stone White
          border: `4px solid ${theme.palette.primary.main}`, // Green for light, Orange for dark
          borderRadius: "50%",
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 0 20px ${theme.palette.primary.light}, 0 0 30px ${theme.palette.accent.main} inset` // Dark mode glow
              : `0 0 20px ${theme.palette.primary.light}, 0 0 30px ${theme.palette.primary.light} inset`, // Light mode glow (green based)
          my: 2,
          position: "relative",
        }}
      >
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontFamily: "'Segment7', 'MedievalSharp', cursive",
            fontSize: { xs: "3.5rem", sm: "5rem", md: "6.5rem" }, // Adjusted for container
            color:
              theme.palette.mode === "dark"
                ? theme.palette.accent.main // Gold for Dark Mode
                : theme.palette.primary.dark, // Dark Green for Light Mode
            lineHeight: 1,
            textShadow:
              theme.palette.mode === "dark"
                ? `0 0 10px ${theme.palette.accent.light}` // Gold glow
                : `0 0 8px ${theme.palette.primary.light}`, // Subtle Green glow
          }}
        >
          {timeLeft}
        </Typography>
      </Box>

      {/* Timer Control Buttons */}
      <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
        <Button
          variant="contained"
          onClick={onToggle}
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          disabled={isTimerDisabled && !isRunning}
          // REVISED: Using the semantic color prop. The theme handles the rest!
          color={isRunning ? "warning" : "success"}
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<ReplayIcon />}
          disabled={isTimerDisabled && !isRunning}
          // REVISED: Using the semantic color prop simplifies this greatly.
          color="secondary"
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};
export default TimerUI;
