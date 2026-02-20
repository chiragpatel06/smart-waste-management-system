import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff
} from "lucide-react";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.phone) newErrors.phone = "Contact number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter valid 10-digit number";

    if (!form.address) newErrors.address = "Address is required";

    if (!form.password)
      newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters";

    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
        }
      );

      alert(res.data.message);
      navigate("/login");

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
        <h1>Registration</h1>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>
          {errors.name && <span className="error">{errors.name}</span>}

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

          {/* PHONE */}
          <div className="input-group">
            <Phone size={18} />
            <input
              type="text"
              placeholder="Contact Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>
          {errors.phone && <span className="error">{errors.phone}</span>}

          {/* ADDRESS */}
          <div className="input-group">
            <MapPin size={18} />
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>
          {errors.address && <span className="error">{errors.address}</span>}

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
                setShowPassword(false);
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

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => {
                setConfirmFocused(false);
                setShowConfirmPassword(false); 
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
            />

            {confirmFocused && (
              showConfirmPassword ? (
                <EyeOff
                  size={18}
                  className="eye-icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="eye-icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirmPassword(true)}
                />
              )
            )}
          </div>

          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
