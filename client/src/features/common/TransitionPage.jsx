import { useState, useEffect } from "react"; // Add useEffect
import { useNavigate } from "react-router-dom";
import scrollImage from "../../assets/images/ui/DragonFocusScroll.png";

export default function TransitionPage() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  // This will run once, as soon as the component mounts
  useEffect(() => {
    setFadeOut(true); // Start the fade-out immediately
    setTimeout(() => {
      navigate("/"); // Navigate after the animation
    }, 2500);
  }, [navigate]); // navigate is a dependency of useEffect

  return (
    // You can remove the button if you make it automatic
    <div className={`transition-container ${fadeOut ? "fade-out" : ""}`}>
      <img src={scrollImage} alt="Ancient Scroll" className="scroll-image" />
    </div>
  );
}
