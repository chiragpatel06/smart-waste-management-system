import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCollector.css";

function AddCollector() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    status: "Available",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.area) newErrors.area = "Area is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 🔥 Get existing collectors from localStorage
    const existingCollectors =
      JSON.parse(localStorage.getItem("collectors")) || [];

    // 🔥 Create new collector with unique ID
    const newCollector = {
      id:
        existingCollectors.length > 0
          ? existingCollectors[existingCollectors.length - 1].id + 1
          : 1,
      ...form,
    };

    const updatedCollectors = [...existingCollectors, newCollector];

    // 🔥 Save back to localStorage
    localStorage.setItem(
      "collectors",
      JSON.stringify(updatedCollectors)
    );

    navigate("/admin/collectors");
  };

  return (
    <div className="add-collector-page">
      <div className="add-collector-card">
        <h1>Add New Collector</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Collector Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <input
            type="text"
            placeholder="Area Assigned"
            value={form.area}
            onChange={(e) =>
              setForm({ ...form, area: e.target.value })
            }
          />
          {errors.area && <span className="error">{errors.area}</span>}

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
          </select>

          <button type="submit">Add Collector</button>
        </form>
      </div>
    </div>
  );
}

export default AddCollector;