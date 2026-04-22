import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";

import LiveTracking from "./pages/LiveTracking";
import Contact from "./pages/Contact";
import ReportWaste from "./pages/ReportWaste";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute"
import ProtectedAuth from "./pages/ProtectedAuth"

import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminLogin from "./components/Admin/AdminLogin";
import WasteReports from "./components/Admin/WasteReports";
import Collectors from "./components/Admin/Collectors";
import AddCollector from "./components/Admin/AddCollector";
import Analytics from "./components/Admin/Analytics";
import Messages from "./components/Admin/Messages";

import CollectorDashboard from "./components/Collector/CollectorDashboard";

// Layout for Public Pages (Maintains Navbar/Footer state)
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <Routes>

        {/* ================= PUBLIC PAGES (Wrapped in Layout) ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/services/tracking"
            element={
              <ProtectedRoute>
                <LiveTracking />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportWaste />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <ProtectedAuth>
                <Login />
              </ProtectedAuth>
            }
          />

          <Route
            path="/register"
            element={
              <ProtectedAuth>
                <Register />
              </ProtectedAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= ADMIN LOGIN ROUTE ================= */}
        <Route 
          path="/admin-login" 
          element={
            <ProtectedAuth adminAuth={true}>
              <AdminLogin />
            </ProtectedAuth>
          } 
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="waste-reports" element={<WasteReports />} />
          <Route path="collectors" element={<Collectors />} />
          <Route path="add-collector" element={<AddCollector />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* ================= COLLECTOR ROUTE ================= */}
        <Route path="/collector" element={<CollectorDashboard />} />
        <Route path="/collectors" element={<Navigate to="/admin/collectors" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;