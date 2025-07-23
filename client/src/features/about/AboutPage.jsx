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
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories"; // Icon for scroll/lore
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // Thematic
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"; // For vision/future
import GroupAddIcon from "@mui/icons-material/GroupAdd"; // For community/beta
import FavoriteIcon from "@mui/icons-material/Favorite"; // For support
import ConstructionIcon from "@mui/icons-material/Construction"; // For current state
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // For gamification
import SchoolIcon from "@mui/icons-material/School"; // For learning

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
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        // This Box can be transparent or use background.default,
        // as the Paper below will define the main content surface.
      }}
    >
      <Paper
        elevation={3} // Consistent with panel shadows
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.paper", // Crucial for the panel look
          border: 1,
          borderColor: "divider", // Thematic border
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? `0px 0px 15px 0px ${theme.palette.primary.main}`
              : `0px 0px 15px 0px ${theme.palette.secondary.main}`, // Thematic shadow
          color: "text.primary",
          maxHeight: "calc(100vh - 120px)", // Adjust based on Topbar/other fixed elements
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          textAlign="center"
          sx={{
            color: "accent.main",
            fontWeight: "bold",
            mb: 3,
            fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
            textShadow: (theme) =>
              `2px 2px 4px ${
                theme.palette.mode === "dark"
                  ? theme.palette.common.black
                  : theme.palette.grey[500]
              }`,
          }}
        >
          The Saga of Dragon Focus
        </Typography>
        <Typography
          variant="h5"
          component="p"
          textAlign="center"
          sx={{
            color: "text.secondary",
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
          icon={
            <AutoStoriesIcon sx={{ color: "accent.main" }} fontSize="large" />
          }
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

        {/* --- Current State (v0.8 Beta) --- */}
        <SectionTitle
          icon={<ConstructionIcon color="info" fontSize="large" />}
          title="The Beta Stronghold (v0.8)"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          You stand at the threshold of our v0.8 Beta release. This version lays
          the critical foundation:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <LocalFireDepartmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="A robust Pomodoro Timer: Your core tool for focused work." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocalFireDepartmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Session Tracking: Record and monitor your heroic focus efforts." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocalFireDepartmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Project & Task Management: Organize your quests with clarity." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocalFireDepartmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="MERN Stack Power: Built on a solid MongoDB, Express.js, React.js, Node.js foundation with user authentication." />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mt: 1, mb: 2, lineHeight: 1.7 }}>
          This Beta is your first call to adventure! Your insights, experiences,
          and suggestions are the dragon scales that will fortify our app,
          directly shaping its destiny.
        </Typography>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- Where We Are Going --- */}
        <SectionTitle
          icon={<RocketLaunchIcon color="success" fontSize="large" />}
          title="The Dragon's Ascent: Our Visionary Flight"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          While the current stronghold offers powerful tools, our ultimate
          vision is to transform Dragon Focus into a realm where mastering
          concentration is the grandest of adventures – your ascent to becoming
          a legendary "Dragon Warrior" of focus. Imagine an interactive world
          where your workspace is an ancient, unfurling scroll.
        </Typography>

        <Typography
          variant="h4"
          component="h3"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            mt: 3,
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
          }}
        >
          Future Scrolls of Power (Planned Features):
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <EmojiEventsIcon sx={{ color: "accent.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="Unlockable Characters & Pets:"
              secondary="Summon 2D sprite Focus Guardians (ninjas, dragon companions) to accompany your sessions."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmojiEventsIcon sx={{ color: "accent.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="Character & Pet Progression:"
              secondary="Your focus fuels their evolution! Watch them level up and gain new appearances."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmojiEventsIcon sx={{ color: "accent.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="In-App Currency (Focus Gems):"
              secondary="Earn gems by completing sessions to unlock guardians, UI themes, and more."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmojiEventsIcon sx={{ color: "accent.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="Themed Progression & Quests:"
              secondary="Embark on 'Focus Quests' via a 2D map, turning projects into heroic journeys."
            />
          </ListItem>
        </List>

        <Typography
          variant="h4"
          component="h3"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            mt: 3,
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
          }}
        >
          Ancient Wisdom, Modern Focus:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon sx={{ color: "secondary.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="Integrated Learning Companion:"
              secondary="Discover tips on focus, learning strategies (inspired by 'Limitless' by Jim Kwik, 'Learning How to Learn' by Dr. Barbara Oakley), and habit formation to refine *how* you focus, not just how long."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon sx={{ color: "secondary.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="Your Focus Ally:"
              secondary="Dragon Focus aims to be more than a tool; it's a companion that understands the challenges of deep work and supports your growth in building resilient focus habits."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- Why Invest Your Time in this Beta? --- */}
        <SectionTitle
          icon={<GroupAddIcon color="warning" fontSize="large" />}
          title="Join the Vanguard: Why Your Beta Participation Matters"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          If you seek a productivity companion that transcends the mundane, your
          time in the Dragon Focus beta is an opportunity to co-create something
          legendary. By using v0.8 and sharing your wisdom, you directly
          influence:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="The evolution of character unlocking and leveling." />
          </ListItem>
          <ListItem>
            <ListItemText primary="The type of learning wisdom shared." />
          </ListItem>
          <ListItem>
            <ListItemText primary="The creation of an experience that makes improving focus genuinely rewarding and fun." />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mt: 1, mb: 2, lineHeight: 1.7 }}>
          Witness and shape its transformation into the ambitious Dragon Warrior
          experience we envision. Be the guiding wind beneath our wings!
        </Typography>

        <Divider sx={{ my: 3, borderColor: "divider", borderWidth: "1px" }} />

        {/* --- Support Development --- */}
        <SectionTitle
          icon={<FavoriteIcon color="error" fontSize="large" />}
          title="Fuel the Forge: Support Our Quest"
        />
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          Dragon Focus is a passion project, forged in dedication and dreams. If
          you believe in our vision for a unique, gamified productivity and
          learning companion, here’s how you can lend your strength:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Engage with the v0.8 Beta: Your feedback is the most precious ore!" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Report Bugs: Help us vanquish issues on our GitHub Issues page." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Spread the Word: Share Dragon Focus with fellow seekers of focus." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Developer Allies: Consider contributing to the project (see our GitHub guidelines)." />
          </ListItem>
        </List>
        <Typography
          variant="body1"
          sx={{ mt: 2, mb: 3, fontWeight: "bold", textAlign: "center" }}
        >
          Every act of support helps bring the full Dragon Focus vision to life!
        </Typography>

        {/* --- Placeholder for Donation --- */}
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
            Enjoying the Journey? Help Us Soar!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
            If Dragon Focus aids your quests and you'd like to support its
            continued development and future enhancements, consider fueling our
            efforts.
          </Typography>
          <Button
            variant="contained"
            color="success" // Or use 'primary' or 'secondary' based on theme
            size="large"
            href="YOUR_DONATION_LINK_HERE" // <-- REPLACE THIS
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<FavoriteIcon />}
            sx={{
              textTransform: "none", // Keeps the text as is
              fontSize: "1.1rem",
              px: 3,
              py: 1.5,
              // Example of thematic button styling
              // boxShadow: (theme) => `0px 0px 8px 0px ${theme.palette.success.main}`
            }}
          >
            Buy the Developer a Coffee (or Dragon Fruit!)
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
