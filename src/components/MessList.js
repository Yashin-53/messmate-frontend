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

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
  });

  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ========================================
  // FETCH MESSES
  // ========================================

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

  // ========================================
  // SEARCH MESSES
  // ========================================

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

  // ========================================
  // LOAD MESSES
  // ========================================

  useEffect(() => {
    if (!location.trim()) {
      fetchMesses(page);
    }
  }, [fetchMesses, page, refresh, location]);

  // ========================================
  // CLEAR SEARCH
  // ========================================

  const handleClearSearch = () => {
    setLocation("");
    setPage(1);
    fetchMesses(1);
  };

  // ========================================
  // START EDIT
  // ========================================

  const handleEdit = (mess) => {
    setEditingId(mess._id);

    setEditForm({
      name: mess.name || "",
      location: mess.location || "",
      price: mess.price || "",
      rating: mess.rating ?? "",
    });

    setError("");
  };

  // ========================================
  // CANCEL EDIT
  // ========================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditForm({
      name: "",
      location: "",
      price: "",
      rating: "",
    });
  };

  // ========================================
  // EDIT INPUT CHANGE
  // ========================================

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // ========================================
  // UPDATE MESS
  // PUT /messes/:id
  // ========================================

  const handleUpdate = async (id) => {
    if (
      !editForm.name.trim() ||
      !editForm.location.trim() ||
      editForm.price === ""
    ) {
      setError("Name, location and price are required.");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await api.put(`/messes/${id}`, {
        name: editForm.name.trim(),
        location: editForm.location.trim(),
        price: Number(editForm.price),
        rating:
          editForm.rating === ""
            ? undefined
            : Number(editForm.rating),
      });

      setMesses((prevMesses) =>
        prevMesses.map((mess) =>
          mess._id === id ? response.data : mess
        )
      );

      handleCancelEdit();
    } catch (error) {
      console.error("PUT /messes error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update mess."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // DELETE MESS
  // DELETE /messes/:id
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this mess?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/messes/${id}`);

      setMesses((prevMesses) =>
        prevMesses.filter((mess) => mess._id !== id)
      );

      if (messes.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchMesses(page);
      }
    } catch (error) {
      console.error("DELETE /messes error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete mess."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // LOADING
  // ========================================

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

      {/* Error */}
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
              {editingId === mess._id ? (
                /* ========================================
                   EDIT MODE
                   ======================================== */
                <div className="edit-mess-form">
                  <h3>Edit Mess</h3>

                  <div>
                    <label>Mess Name</label>

                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div>
                    <label>Location</label>

                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div>
                    <label>Monthly Price (₹)</label>

                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      min="0"
                    />
                  </div>

                  <div>
                    <label>Rating</label>

                    <input
                      type="number"
                      name="rating"
                      value={editForm.rating}
                      onChange={handleEditChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0 - 5"
                    />
                  </div>

                  <button
                    onClick={() => handleUpdate(mess._id)}
                    disabled={updating}
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* ========================================
                   NORMAL VIEW
                   ======================================== */
                <div className="mess-item">
                  <div className="mess-info">
                    <strong>{mess.name}</strong>

                    <span>
                      Location: {mess.location}
                    </span>

                    <span>
                      Monthly Price: ₹{mess.price}
                    </span>

                    {mess.rating !== undefined &&
                      mess.rating !== null && (
                        <span>
                          Rating: ⭐ {mess.rating}
                        </span>
                      )}
                  </div>

                  <div className="mess-actions">
                    <button
                      onClick={() => handleEdit(mess)}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(mess._id)}
                      disabled={deletingId === mess._id}
                    >
                      {deletingId === mess._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {!location && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() =>
              setPage((prev) => prev - 1)
            }
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((prev) => prev + 1)
            }
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