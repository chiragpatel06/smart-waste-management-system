import { BrowserRouter, Routes, Route } from "react-router-dom";

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

import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import WasteReports from "./components/Admin/WasteReports";
import Collectors from "./components/Admin/Collectors";
import AddCollector from "./components/Admin/AddCollector";
import Analytics from "./components/Admin/Analytics";

import CollectorDashboard from "./components/Collector/CollectorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC PAGES ================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />

        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Services />
              <Footer />
            </>
          }
        />

        <Route
          path="/services/tracking"
          element={
            <>
              <Navbar />
              <LiveTracking />
              <Footer />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />

        <Route
          path="/report"
          element={
            <>
              <Navbar />
              <ReportWaste />
              <Footer />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
              <Footer />
            </>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="waste-reports" element={<WasteReports />} />
          <Route path="collectors" element={<Collectors />} />
          <Route path="add-collector" element={<AddCollector />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* ================= COLLECTOR ROUTE ================= */}

        <Route path="/collector" element={<CollectorDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;