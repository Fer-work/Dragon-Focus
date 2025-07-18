import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage.jsx";
import Layout from "./layouts/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import Landing from "./components/Landing.jsx";
import AboutPage from "./pages/AboutPage.jsx";

// Router Configuration
const routes = [
  {
    path: "/landing",
    element: <Landing />, // import at the top
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/stats", element: <StatsPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/create-account", element: <CreateAccountPage /> },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  const [theme, colorMode] = useMode(); // Custom hook to switch theme mode

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
