import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("/api/users/add", {
        name,
        email,
        password,
      });
      toast.success("User added successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-4">
        <h1 className="h2 mb-4">Add User</h1>
        <form onSubmit={handleSubmit}>
          <div className="card p-4 mb-md-4 mb-3">
            {/* <h2 className="h5 mb-3">User Details</h2> */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn">
            Add User
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUser;
