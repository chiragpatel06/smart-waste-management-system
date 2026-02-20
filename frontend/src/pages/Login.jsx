import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./Auth.css";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post("/users/login", form);

      localStorage.setItem("token", res.data.token);
      alert(res.data.message);

      navigate("/");

    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>
          {errors.email && <span className="error">{errors.email}</span>}

          {/* PASSWORD */}
          {/* PASSWORD */}
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => {
                setPasswordFocused(false);
                setShowPassword(false);   // 👈 auto hide password
              }}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {passwordFocused && (
              showPassword ? (
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
              )
            )}
          </div>

          {errors.password && <span className="error">{errors.password}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
