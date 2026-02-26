import "./CloseButton.css";

function CloseButton({ onClick }) {
  return (
    <button className="app-close-btn" onClick={onClick}>
      ✕
    </button>
  );
}

export default CloseButton;