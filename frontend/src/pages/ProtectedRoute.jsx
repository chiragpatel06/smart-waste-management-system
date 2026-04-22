import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin") || "false");

  // Agar login nahi hai → redirect to appropriate login page
  if (!token) {
    const loginPath = adminOnly ? "/admin-login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Agar admin page hai aur user admin nahi hai → redirect to home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }



  return children;
};

export default ProtectedRoute;