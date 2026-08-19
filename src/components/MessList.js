import { useEffect, useState } from "react";
import api from "../services/api";

function MessList({ refresh }) {
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/messes");

      console.log("Messes:", response.data);

      setMesses(response.data.messes);

    } catch (error) {
      console.error("GET /messes error:", error);

      setError("Failed to fetch mess data.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading) {
    return <p>Loading messes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>All Messes</h2>

      {messes.length === 0 ? (
        <p>No messes found.</p>
      ) : (
        <ul>
          {messes.map((mess) => (
            <li key={mess.id}>
              <strong>{mess.name}</strong>
              {" - "}
              {mess.location}
              {" - "}
              ₹{mess.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MessList;