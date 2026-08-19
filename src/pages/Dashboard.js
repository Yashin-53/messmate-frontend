import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome, {user?.username}!</h2>

      <p>You are successfully authenticated.</p>

      <p>
        <strong>User ID:</strong> {user?.userId}
      </p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
