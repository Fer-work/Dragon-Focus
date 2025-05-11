import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Box } from "@mui/material";
import { SettingsProvider } from "./utils/SettingsContext.jsx"; // Import the provider

export default function Layout() {
  return (
    <SettingsProvider>
      {/* Wrap the content with the provider */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
          height: "100%",
        }}
      >
        {/* Box for App */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "95vw",
            height: "90vh",
            borderRadius: 3,
            padding: 2,
            bgcolor: "background.fire",
          }}
        >
          {/* Box for Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: "20%" },
              height: "100%",
              bgcolor: "background.paper",
              padding: 2,
              borderRadius: 3,

              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
              position: { md: "sticky" },
            }}
          >
            <Sidebar />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "background.default",
              borderRadius: 2,
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              sx={{
                padding: 2,
              }}
            >
              <Topbar />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                padding: 2,
                margin: 0,
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </SettingsProvider>
  );
}
