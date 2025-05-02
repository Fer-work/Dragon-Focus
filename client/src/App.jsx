import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import HomePage from "./pages/Home.jsx";
import Layout from "./Layout.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
import StatsPage, { statsLoader } from "./pages/Stats.jsx";
import SettingsPage from "./pages/Settings.jsx";

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/stats",
        element: <StatsPage />,
        loader: statsLoader,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/create-account",
        element: <CreateAccountPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  const [theme, colorMode] = useMode();

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
