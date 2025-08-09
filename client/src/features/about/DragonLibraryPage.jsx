// client/src/features/about/DragonLibraryPage.jsx
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import TimerIcon from "@mui/icons-material/Timer";
import PsychologyIcon from "@mui/icons-material/Psychology";
import NotFoundPage from "../common/NotFoundPage";

// Helper component for section titles
const SectionTitle = ({ icon, title, color = "primary.main" }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 3 }}>
    {icon}
    <Typography
      variant="h2"
      component="h2"
      sx={{
        color: color,
        fontWeight: "bold",
        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
      }}
    >
      {title}
    </Typography>
  </Box>
);

// Reusable card for displaying a resource
const ResourceCard = ({ title, author, description, link }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        bgcolor: "action.hover",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5, color: "text.secondary" }}>
          by {author}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          component={RouterLink} // Use the RouterLink component
          to={link} // Pass the string URL to the 'to' prop
          size="small"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="primary"
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default function DragonLibraryPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: { xs: 1, sm: 2 },
        color: "text.primary",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.paper",
          borderRadius: 3,
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: `0px 0px 5px 2px ${theme.palette.accent.main}`,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          sx={{
            color: theme.palette.primary.main,
            fontStyle: "italic",
            mb: 4,
            maxWidth: "80%",
            mx: "auto",
          }}
        >
          Ancient Wisdom for Modern Focus. Master the techniques, explore the
          knowledge.
        </Typography>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- How It Works Section --- */}
        <SectionTitle
          icon={<TimerIcon color="accent" fontSize="large" />}
          title="The Way of the Timer"
          color="accent.main"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          Dragon Focus is built upon the Pomodoro Technique, a powerful method
          for improving focus and managing time. The process is simple but
          effective:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>1.</ListItemIcon>
            <ListItemText
              primary="Choose Your Quest:"
              secondary="Pick a single task you want to work on."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>2.</ListItemIcon>
            <ListItemText
              primary="Set the Timer:"
              secondary="Work with intense focus for a set interval (e.g., 25 minutes)."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>3.</ListItemIcon>
            <ListItemText
              primary="Take a Short Break:"
              secondary="After the timer rings, take a short break (e.g., 5 minutes). Stretch, get water, rest your eyes."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>4.</ListItemIcon>
            <ListItemText
              primary="Repeat & Conquer:"
              secondary="After four focus sessions, take a longer break (e.g., 15-30 minutes)."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- Recommended Resources Section --- */}
        <SectionTitle
          icon={<MenuBookIcon color="info" fontSize="large" />}
          title="Tomes of Power"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          The philosophy of Dragon Focus is inspired by giants in the fields of
          learning and productivity. Explore these resources to deepen your own
          practice.
        </Typography>

        <ResourceCard
          title="Limitless"
          author="Jim Kwik"
          description="A foundational guide to meta-learning. Kwik breaks down the science of learning how to learn, improving memory, and reading faster."
          link="/broken"
        />
        <ResourceCard
          title="Learning How to Learn (Coursera)"
          author="Dr. Barbara Oakley & Dr. Terrence Sejnowski"
          description="The most popular online course in the world. It provides practical, neuroscience-based techniques for tackling difficult subjects."
          link="#broken"
        />
        <ResourceCard
          title="Atomic Habits"
          author="James Clear"
          description="An essential read for understanding how to build good habits and break bad ones. Perfect for making your focus practice stick."
          link="#"
        />
      </Paper>
    </Box>
  );
}
