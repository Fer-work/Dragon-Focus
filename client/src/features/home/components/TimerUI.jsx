import { Box, Button, Typography, useTheme, ButtonGroup } from "@mui/material";

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

  const getSessionButtonStyle = (sessionName) => ({
    flexGrow: 1,
    color:
      currentSession === sessionName
        ? theme.palette.getContrastText(theme.palette.primary.main)
        : theme.palette.text.secondary,
    borderColor:
      currentSession === sessionName
        ? theme.palette.primary.dark // Active border
        : theme.palette.neutral[theme.palette.mode === "dark" ? 600 : 300], // Inactive border
    backgroundColor:
      currentSession === sessionName
        ? theme.palette.primary.main
        : "transparent",
    "&:hover": {
      backgroundColor:
        currentSession === sessionName
          ? theme.palette.primary.dark
          : theme.palette.action.hover,
      borderColor:
        currentSession === sessionName
          ? theme.palette.primary.dark
          : theme.palette.primary.light,
    },
    "&.Mui-disabled": {
      // Style for when ButtonGroup is disabled
      borderColor: theme.palette.action.disabledBackground,
    },
  });

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
      {/* Session Type Buttons */}
      <ButtonGroup
        variant="outlined" // Base variant, active button will override to contained
        aria-label="session type button group"
        fullWidth
        sx={{ mb: 3 }}
        disabled={isRunning || isTimerDisabled} // Disable changing session type while running OR if globally disabled
      >
        <Button
          onClick={() => onChangeSession("pomodoro")}
          variant={currentSession === "pomodoro" ? "contained" : "outlined"}
          sx={getSessionButtonStyle("pomodoro")}
          startIcon={<TimerIcon />}
        >
          Pomodoro
        </Button>
        <Button
          onClick={() => onChangeSession("shortBreak")}
          variant={currentSession === "shortBreak" ? "contained" : "outlined"}
          sx={getSessionButtonStyle("shortBreak")}
          startIcon={<FreeBreakfastIcon />}
        >
          Short Break
        </Button>
        <Button
          onClick={() => onChangeSession("longBreak")}
          variant={currentSession === "longBreak" ? "contained" : "outlined"}
          sx={getSessionButtonStyle("longBreak")}
          startIcon={<FreeBreakfastIcon />}
        >
          Long Break
        </Button>
      </ButtonGroup>

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
      <ButtonGroup
        variant="contained"
        aria-label="timer control button group"
        sx={{ gap: { xs: 1, sm: 2 } }}
        disabled={isTimerDisabled && !isRunning} // Only disable if globally disabled AND timer is not running (allows pausing)
      >
        <Button
          variant="contained"
          onClick={onToggle}
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          disabled={isTimerDisabled && !isRunning} // Specifically disable start if globally disabled
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
            bgcolor: isRunning
              ? theme.palette.warning.main // Use warning color (orange) for Pause
              : theme.palette.success.main,
            color: theme.palette.getContrastText(
              isRunning
                ? theme.palette.warning.main
                : theme.palette.success.main
            ),
            "&:hover": {
              bgcolor: isRunning
                ? theme.palette.warning.dark
                : theme.palette.success.dark,
            },
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<ReplayIcon />}
          // Reset button should be available even if timerDisabledProp is true, as long as timer is running or was running
          disabled={isTimerDisabled && !isRunning}
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" },
            color: "secondary.main",
            borderColor:
              theme.palette.mode === "dark"
                ? "secondary.light"
                : "secondary.main", // Ensure visibility in light mode
            "&:hover": {
              borderColor: "secondary.dark",
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Reset
        </Button>
      </ButtonGroup>
    </Box>
  );
};
export default TimerUI;
