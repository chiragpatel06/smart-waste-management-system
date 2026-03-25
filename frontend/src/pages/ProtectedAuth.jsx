import { Navigate } from "react-router-dom";

const ProtectedAuth = ({ children }) => {
  const token = localStorage.getItem("token");

  // Agar login hai → redirect to home
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAuth;