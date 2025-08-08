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
  useTheme, // Import useTheme
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories"; // Icon for scroll/lore
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // Thematic
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"; // For vision/future
import GroupAddIcon from "@mui/icons-material/GroupAdd"; // For community/beta
import FavoriteIcon from "@mui/icons-material/Favorite"; // For support
import ConstructionIcon from "@mui/icons-material/Construction"; // For current state
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // For gamification
import SchoolIcon from "@mui/icons-material/School"; // For learning
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// Helper component for section titles to keep styling consistent
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

export default function AboutPage() {
  const theme = useTheme(); // Get the theme object

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
        elevation={0} // Consistent with panel shadows
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.paper",
          borderRadius: 3,
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: `0px 0px 5px 2px ${theme.palette.accent.main}`,
          maxHeight: "100%", // Let the parent Box handle height constraints
          height: "100%",
          color: "text.primary",
          overflowY: "auto", // Ensure content inside the paper scrolls
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
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          Forge Your Focus, Unleash Your Inner Dragon Warrior, and Master the
          Art of Learning.
        </Typography>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- What is Dragon Focus? --- */}
        <SectionTitle
          icon={<AutoStoriesIcon color="accent" fontSize="large" />}
          title="Our Quest: The Genesis of Dragon Focus"
          color="accent.main"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          Welcome, Seeker of Focus! Dragon Focus is not merely an application;
          it's your dedicated companion on an epic journey to enhance
          productivity and cultivate deep, sustained concentration. We fuse
          proven techniques like the Pomodoro Method with a unique, gamified
          "Dragon Warrior" environment. Our mission is to make the path to
          mastery both effective and exhilarating.
        </Typography>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- Where We Are Going --- */}
        <SectionTitle
          icon={<RocketLaunchIcon color="success" fontSize="large" />}
          title="The Dragon's Ascent: Our Visionary Flight"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          The current app is just the foundation. Our ultimate vision is to
          transform Dragon Focus into a realm where mastering concentration is
          the grandest of adventures. We envision a future where your focus
          sessions help you raise and train a dragon companion, where you embark
          on 'Focus Quests' to complete your projects, and where you can
          visually see your skills grow in a personalized skill tree.
        </Typography>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- Why Invest Your Time in this Beta? --- */}
        <SectionTitle
          icon={<GroupAddIcon color="warning" fontSize="large" />}
          title="Join the Vanguard: Why Your Participation Matters"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          You stand at the threshold of our v0.8 Beta release. By using the app
          and sharing your wisdom, you become a co-creator of this legend. Your
          feedback will directly influence how we build the character
          progression, the types of quests we design, and the overall experience
          of making focus genuinely fun.
        </Typography>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- Support Development --- */}
        <SectionTitle
          icon={<FavoriteIcon color="error" fontSize="large" />}
          title="Fuel the Forge: Support Our Quest"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          Dragon Focus is a passion project. If you believe in our vision, the
          best way to lend your strength is to use the app, report any bugs you
          find, and share it with fellow seekers of focus.
        </Typography>

        {/* --- Donation Section --- */}
        <Box
          sx={{
            textAlign: "center",
            my: 4,
            p: 3,
            bgcolor: "action.hover",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{ color: "primary.main", fontWeight: "bold", mb: 2 }}
          >
            Enjoying the Journey? Help Us Soar.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="https://buymeacoffee.com/dragonfocus"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<FavoriteIcon />}
            sx={{
              fontSize: "1.1rem",
              px: 3,
              py: 1.5,
            }}
          >
            Buy the Developer a Coffee
          </Button>
        </Box>

        <Typography
          variant="body1"
          sx={{
            mt: 4,
            textAlign: "center",
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          Thank you for being a vital part of the Dragon Focus legend!
        </Typography>
      </Paper>
    </Box>
  );
}
