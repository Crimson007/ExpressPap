import React, { useState } from 'react';
import axios from 'axios';

// Use the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    ownerName: '',
    carType: '',
    brand: '',
    color: '',
    contact: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation for empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key} cannot be blank`;
      }
    });

    // Phone number validation (Kenyan format: starts with 07 or 01 and has 10 digits)
    if (formData.contact && !/^(07|01)\d{8}$/.test(formData.contact)) {
      newErrors.contact = 'Phone number must start with "07" or "01" and contain 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Automatically record the current date
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        ...formData,
        registrationDate: currentDate, // Add the current date to the payload
      });
      alert(response.data.message);
      setFormData({
        licensePlate: '',
        ownerName: '',
        carType: '',
        brand: '',
        color: '',
        contact: '',
      });
      setErrors({});
    } catch (error) {
      alert('Error registering vehicle. Please try again.');
    }
  };

  const carTypes = [
    'Sedan', 'SUV', 'Truck', 'Van', 'Bus', 'Motorcycle', 'Pickup', 'Station Wagon',
    'Coupe', 'Convertible', 'Minivan',
  ];

  const carBrands = [
    'Toyota', 'Nissan', 'Mitsubishi', 'Mazda', 'Subaru', 'Honda', 'Isuzu', 'Mercedes-Benz',
    'BMW', 'Volkswagen', 'Hyundai', 'Kia', 'Ford', 'Chevrolet',
  ];

  const carColors = [
    'Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Yellow', 'Brown', 'Orange', 'Purple',
  ];

  return (
    <div className="container mx-auto my-4 p-4 bg-dark-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Vehicle Registration</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <label htmlFor="licensePlate" className="block text-sm font-medium text-light-200 mb-2">
            License Plate
          </label>
          <input
            type="text"
            name="licensePlate"
            placeholder="e.g., ABC123"
            value={formData.licensePlate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white placeholder-light-200 ${
              errors.licensePlate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.licensePlate && (
            <div className="text-red-500 text-sm mt-1">{errors.licensePlate}</div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="ownerName" className="block text-sm font-medium text-light-200 mb-2">
            Owner Name
          </label>
          <input
            type="text"
            name="ownerName"
            placeholder="Full Name"
            value={formData.ownerName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white placeholder-light-200 ${
              errors.ownerName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.ownerName && (
            <div className="text-red-500 text-sm mt-1">{errors.ownerName}</div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="carType" className="block text-sm font-medium text-light-200 mb-2">
            Car Type
          </label>
          <select
            name="carType"
            value={formData.carType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white ${
              errors.carType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="" className="text-gray-400">Select Car Type</option>
            {carTypes.map((type, index) => (
              <option key={index} value={type} className="text-dark-100">
                {type}
              </option>
            ))}
          </select>
          {errors.carType && (
            <div className="text-red-500 text-sm mt-1">{errors.carType}</div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="brand" className="block text-sm font-medium text-light-200 mb-2">
            Brand
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white ${
              errors.brand ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="" className="text-gray-400">Select Brand</option>
            {carBrands.map((brand, index) => (
              <option key={index} value={brand} className="text-dark-100">
                {brand}
              </option>
            ))}
          </select>
          {errors.brand && (
            <div className="text-red-500 text-sm mt-1">{errors.brand}</div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="color" className="block text-sm font-medium text-light-200 mb-2">
            Color
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white ${
              errors.color ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="" className="text-gray-400">Select Color</option>
            {carColors.map((color, index) => (
              <option key={index} value={color} className="text-dark-100">
                {color}
              </option>
            ))}
          </select>
          {errors.color && (
            <div className="text-red-500 text-sm mt-1">{errors.color}</div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="contact" className="block text-sm font-medium text-light-200 mb-2">
            Contact
          </label>
          <input
            type="text"
            name="contact"
            placeholder="Phone Number (e.g., 0712345678)"
            value={formData.contact}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white placeholder-light-200 ${
              errors.contact ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contact && (
            <div className="text-red-500 text-sm mt-1">{errors.contact}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
