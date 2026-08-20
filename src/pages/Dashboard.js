import React, { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext";

import AddMessForm from "../components/AddMessForm";
import MessList from "../components/MessList";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [showAddMess, setShowAddMess] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleMessAdded = () => {
    setRefresh((prev) => prev + 1);

    // Hide form after successful addition
    setShowAddMess(false);
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome, {user?.username}!</h2>

      <p>You are successfully authenticated.</p>

      <p>
        <strong>User ID:</strong> {user?.userId}
      </p>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <MessList refresh={refresh} />
      


      <button onClick={() => setShowAddMess(!showAddMess)}>
        {showAddMess ? "Close Add Mess Form" : "Add New Mess"}
      </button>

      {showAddMess && (
        <div>
          <AddMessForm onMessAdded={handleMessAdded} />
        </div>
      )}

    </div>
  );
};

export default Dashboard;