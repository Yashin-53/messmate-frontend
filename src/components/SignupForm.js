import React, { useState } from "react";
import axios from "../axiosConfig";

const SignupForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "/auth/register",
        form
      );

      setMessage(
        "Registration successful! You can now login."
      );

      setForm({
        username: "",
        password: ""
      });

    } catch (err) {
      if (err.response?.status === 409) {
        setError("Username already exists.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed.");
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
      <h2>Create Account</h2>

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
          {loading ? "Creating Account..." : "Register"}
        </button>

      </form>

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SignupForm;