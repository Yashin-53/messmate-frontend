import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

function MessList({ refresh }) {
  const [messes, setMesses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalPages, setTotalPages] = useState(1);

  const [location, setLocation] = useState("");
  const [searching, setSearching] = useState(false);

  const fetchMesses = useCallback(
    async (currentPage = page) => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/messes?page=${currentPage}&limit=${limit}`
        );

        setMesses(response.data.messes || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("GET /messes error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch mess data."
        );
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  const searchMesses = async () => {
    if (!location.trim()) {
      setPage(1);
      fetchMesses(1);
      return;
    }

    try {
      setSearching(true);
      setError("");

      const response = await api.get(
        `/messes/search?location=${encodeURIComponent(location)}`
      );

      setMesses(response.data || []);
      setTotalPages(1);
    } catch (error) {
      console.error("Search messes error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to search messes."
      );
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!location.trim()) {
      fetchMesses(page);
    }
  }, [fetchMesses, page, refresh, location]);

  const handleClearSearch = () => {
    setLocation("");
    setPage(1);
    fetchMesses(1);
  };

  if (loading) {
    return <p>Loading messes...</p>;
  }

  return (
    <div className="mess-list">
      <h2>All Messes</h2>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={searchMesses}
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>

        {location && (
          <button onClick={handleClearSearch}>
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* Mess List */}
      {messes.length === 0 ? (
        <p>No messes found.</p>
      ) : (
        <ul>
          {messes.map((mess) => (
            <li key={mess._id}>
              <strong>{mess.name}</strong>
              {" - "}
              {mess.location}
              {" - ₹"}
              {mess.price}

              {mess.rating !== undefined && (
                <>
                  {" - Rating: "}
                  {mess.rating}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {!location && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default MessList;