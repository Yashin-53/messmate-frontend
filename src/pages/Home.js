import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome to MessMate</h1>

      <p>
        Find and manage mess listings easily.
      </p>

      {!user ? (
        <div>
          <Link to="/login">
            Login
          </Link>

          {" | "}

          <Link to="/signup">
            Create Account
          </Link>
        </div>
      ) : (
        <div>
          <p>
            Welcome back, <strong>{user.username}</strong>!
          </p>

          <Link to="/dashboard">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;