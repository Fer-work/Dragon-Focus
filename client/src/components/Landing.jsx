// src/pages/Landing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css"; // Create this file next

export default function Landing() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/"); // Send to homepage AFTER fadeout
    }, 2500); // match animation duration
  };

  return (
    <div className={`landing-container ${fadeOut ? "fade-out" : ""}`}>
      <img
        src="/src/assets/images/DragonFocusScroll.png"
        alt="Scroll"
        className="scroll-image"
      />
      <button onClick={handleStart} className="start-button">
        Begin
      </button>
    </div>
  );
}
