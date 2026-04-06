import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
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
import WasteReports from "./components/Admin/WasteReports";
import Collectors from "./components/Admin/Collectors";
import AddCollector from "./components/Admin/AddCollector";
import Analytics from "./components/Admin/Analytics";
import UsersManagement from "./components/Admin/UserManagement";

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
      <Routes>

        {/* ================= PUBLIC PAGES (Wrapped in Layout) ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/tracking" element={<LiveTracking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/report" element={<ReportWaste />} />
          
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

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="waste-reports" element={<WasteReports />} />
          <Route path="collectors" element={<Collectors />} />
          <Route path="add-collector" element={<AddCollector />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>

        {/* ================= COLLECTOR ROUTE ================= */}
        <Route path="/collector" element={<CollectorDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;