import { Navigate } from "react-router-dom";

const ProtectedAuth = ({ children, adminAuth = false }) => {
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin") || "false");

  if (token) {
    // Agar login hai aur admin page pe jaana chah raha hai, redirect to admin dashboard
    if (adminAuth && isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    // Agar login hai aur normal user hai, redirect to home
    if (!adminAuth && !isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedAuth;