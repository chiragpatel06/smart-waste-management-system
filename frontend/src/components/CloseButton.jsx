import { X } from "lucide-react";
import "./CloseButton.css";

function CloseButton({ onClick, ariaLabel = "Close" }) {
  return (
    <button 
      className="app-close-btn" 
      onClick={onClick} 
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <X size={20} className="close-icon" />
    </button>
  );
}

export default CloseButton;