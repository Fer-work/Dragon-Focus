import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Box } from "@mui/material";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Use 100vh to fill the entire viewport height
        minWidth: "100vw", // Ensure full width
        padding: 0, // Remove padding that might be pushing content
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          width: "90vw", // Limit width to 90% of the viewport
          height: "90vh", // Limit height to 90% of the viewport
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "20%" },
            bgcolor: "background.paper",
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 3,
            borderRadius: 2,
            position: { md: "sticky" },
            top: 0,
            height: "100%",
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          <Topbar />
          <Box
            sx={{
              flexGrow: 1,
              padding: 3,
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
