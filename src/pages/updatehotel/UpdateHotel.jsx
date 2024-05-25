import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateHotel({ hotelId }) {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  console.log(id);
  const [hotelData, setHotelData] = useState({
    name: "",
    address: "",
    city: "",
    photos: "",
    description: "",
    price: 0,
    latitude: 0,
    longitude: 0,
    featured: false,
    checkInTime: "",
    checkOutTime: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/hotels/${id}`
        );

        setHotelData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while fetching hotel data.");
      }
    };

    fetchHotelData();
  }, [id]);

  const handleChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelData),
      });

      if (response.ok) {
        toast.success("Hotel updated successfully!");
        navigate("/hotel-manager");
      } else {
        toast.error("Failed to update hotel.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the hotel.");
    }
  };

  return (
    <div className="container__add mx-auto px-4 py-8">
      <h1>Update Hotel</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={hotelData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={hotelData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={hotelData.city}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Photos (comma-separated URLs):
          <input
            type="text"
            name="photos"
            value={hotelData.photos}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={hotelData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={hotelData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Latitude:
          <input
            type="number"
            name="latitude"
            value={hotelData.latitude}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Longitude:
          <input
            type="number"
            name="longitude"
            value={hotelData.longitude}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Featured:
          <input
            type="checkbox"
            name="featured"
            checked={hotelData.featured}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Check-In Time:
          <input
            type="text"
            name="checkInTime"
            value={hotelData.checkInTime}
            onChange={handleChange}
          />
        </label>
        <label>
          Check-Out Time:
          <input
            type="text"
            name="checkOutTime"
            value={hotelData.checkOutTime}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Hotel</button>
      </form>
    </div>
  );
}

export default UpdateHotel;
