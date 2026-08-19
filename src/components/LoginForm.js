import React, { useState, useContext } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/auth/login",
        form
      );

      login(response.data.token);

      navigate("/dashboard");

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.username.trim() !== "" &&
    form.password.trim() !== "";

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Username</label>

          <input
            type="text"
            name="username"
            value={form.username}
            placeholder="Enter username"
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Enter password"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default LoginForm;