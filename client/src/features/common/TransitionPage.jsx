import { useState, useEffect } from "react"; // Add useEffect
import scrollImage from "../../assets/images/ui/DragonFocusScroll.png";
import { Box } from "@mui/material";

export default function TransitionPage() {
  const [fadeOut, setFadeOut] = useState(false);

  // This will run once, as soon as the component mounts
  useEffect(() => {
    setFadeOut(true); // Start the fade-out immediately
  }, []); // navigate is a dependency of useEffect

  return (
    // You can remove the button if you make it automatic
    <Box
      sx={{
        height: "50%",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <img src={scrollImage} alt="Ancient Scroll" className="scroll-image" />
    </Box>
  );
}
