import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    menu: "",
    description: "",
    image: "", 
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      name: formData.name,
      location: formData.location,
      menu: formData.menu,
      description: formData.description,
      image: formData.image, 
    };

    try {
      const response = await fetch("http://localhost:4001/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();
      if (response.ok) {
        alert("service added successfully!");
        navigate("/restaurants"); 
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div id="add-restaurant-container">
      <form id="add-restaurant-form" onSubmit={handleSubmit}>
        <h2>Add New service </h2>

        <label> service</label>
        <input
          type="text"
          className="resname"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>service type</label>
        <textarea
          name="menu"
          value={formData.menu}
          onChange={handleChange}
          required
          placeholder="List the service items here"
        ></textarea>

        <label>Address</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Enter a brief Address of your service centre"
        ></textarea>

        <label>service centre  Image (URL)</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Enter image URL"
        />

        <button type="submit">Add service centre</button>
      </form>
    </div>
  );
};

export default AddRestaurant;
