// src/App.jsx

import { ColorModeContext, useMode } from "./themes/themeManager.js";
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
// import lightBackground from "./assets/images/backgrounds/lightBackground.png";

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
  { path: "/transition", element: <TransitionPage /> },
];

function App() {
  const [theme, colorMode] = useMode(); // Custom hook to switch theme mode
  const router = createBrowserRouter(routes); // Define or import your routes

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SettingsProvider>
          <Box
            sx={{
              minHeight: "100%",
              width: "100%",
              backgroundImage: `url(${theme.custom.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <RouterProvider router={router} />
          </Box>
        </SettingsProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
