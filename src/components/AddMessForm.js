import React, {
  useState
} from "react";

import api from "../services/api";


function AddMessForm({ onMessAdded }) {

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: ""
  });


  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    setError("");

    setLoading(true);


    try {

      const response = await api.post(
        "/messes",
        {
          name: formData.name,
          location: formData.location,
          price: Number(formData.price)
        }
      );


      setMessage(
        "Mess added successfully!"
      );


      setFormData({
        name: "",
        location: "",
        price: ""
      });


      if (onMessAdded) {
        onMessAdded(response.data);
      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to add mess."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="form-card">

      <h2>Add New Mess</h2>


      <form onSubmit={handleSubmit}>

        <div className="form-group">

          <label>Mess Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-group">

          <label>Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-group">

          <label>Monthly Price (₹)</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="1000"
            required
          />

        </div>


        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Adding..."
            : "Add Mess"
          }

        </button>

      </form>


      {message && (
        <p className="success-message">
          {message}
        </p>
      )}


      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

    </div>
  );
}


export default AddMessForm;