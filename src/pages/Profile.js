import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/profile");

      setProfile(response.data);

    } catch (error) {
      console.error("Profile fetch error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch profile."
      );

    } finally {
      setLoading(false);
    }
  };


  // Fetch when page opens
  useEffect(() => {
    fetchProfile();
  }, []);


  if (loading) {
    return (
      <div>
        <h2>Profile</h2>
        <p>Loading profile...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div>
        <h2>Profile</h2>

        <p style={{ color: "red" }}>
          {error}
        </p>

        <button onClick={fetchProfile}>
          Try Again
        </button>
      </div>
    );
  }


  return (
    <div>

      <h2>My Profile</h2>

      <p>
        <strong>Username:</strong>{" "}
        {profile.username}
      </p>

      <p>
        <strong>Role:</strong>{" "}
        {profile.role}
      </p>

      <p>
        <strong>Joined:</strong>{" "}
        {new Date(profile.joinedAt).toLocaleDateString()}
      </p>

      <button onClick={fetchProfile}>
        Refresh Profile
      </button>

    </div>
  );
};

export default Profile;