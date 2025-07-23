import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
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
import Transition from "./features/common/TransitionPage.jsx";
import AboutPage from "./features/about/AboutPage.jsx";

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

const router = createBrowserRouter(routes);

function App() {
  const [theme, colorMode] = useMode(); // Custom hook to switch theme mode

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SettingsProvider>
          <RouterProvider router={router} />
        </SettingsProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
