import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/api";
import "../../pages/Auth.css"; // Import shared Auth styles

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      if (!res.data.isAdmin) {
        toast.error("Access Denied: Not an Admin account.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAdmin", JSON.stringify(res.data.isAdmin));

      window.dispatchEvent(new Event("storage"));
      toast.success("Admin Login Successful!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh' }}>
      <div className="auth-card">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <ShieldCheck size={28} /> Admin Login
        </h1>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Admin Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => {
                setPasswordFocused(false);
                setShowPassword(false);
              }}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {passwordFocused &&
              (showPassword ? (
                <EyeOff
                  size={18}
                  className="eye-icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="eye-icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(true)}
                />
              ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
