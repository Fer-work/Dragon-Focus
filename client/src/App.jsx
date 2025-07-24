// src/App.jsx

import {
  TransitionProvider,
  useTransition,
} from "./globalHooks/TransitionContext";
import { ColorModeContext, useMode } from "./theme.js";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Key Fix: Import the SettingsProvider
import { SettingsProvider } from "./features/settings/hooks/SettingsContext";

// Pages
import HomePage from "./features/home/HomePage.jsx";
import Layout from "./layouts/Layout.jsx";
import NotFoundPage from "./features/common/NotFoundPage.jsx";
import StatsPage from "./features/stats/StatsPage.jsx";
import SettingsPage from "./features/settings/SettingsPage.jsx";
import LoginPage from "./features/authentication/LoginPage.jsx";
import CreateAccountPage from "./features/authentication/CreateAccountPage.jsx";
import TransitionPage from "./features/common/TransitionPage.jsx";
import AboutPage from "./features/about/AboutPage.jsx";

// Backgrounds
import lightBackground from "./assets/images/backgrounds/lightBackground.png";
import darkBackground from "./assets/images/backgrounds/darkBackground.png";

// A helper component to render our overlay
const GlobalTransition = () => {
  const { isTransitioning } = useTransition();
  // Render the TransitionPage as an overlay when isTransitioning is true
  return isTransitioning ? <TransitionPage /> : null;
};

// Router Configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/stats", element: <StatsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/create-account", element: <CreateAccountPage /> },
];

function App() {
  const [theme, colorMode] = useMode(); // Custom hook to switch theme mode
  const router = createBrowserRouter(routes); // Define or import your routes

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SettingsProvider>
          <TransitionProvider>
            <Box
              sx={{
                minHeight: "100vh",
                width: "100%",
                backgroundImage: `url(${
                  theme.palette.mode === "dark"
                    ? darkBackground
                    : lightBackground
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                transition: "background-image 0.5s ease-in-out",
              }}
            >
              <GlobalTransition />
              <RouterProvider router={router} />
            </Box>
          </TransitionProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
