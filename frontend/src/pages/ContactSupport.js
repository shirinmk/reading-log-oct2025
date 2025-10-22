


import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ContactSupport = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/support/contact`, form);
      setStatus(res.data.message);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Failed to send message");
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundColor: "#fce8d5",
          minHeight: "100vh",
          paddingTop: "80px",
        }}
      >
        <div className="container d-flex justify-content-center">
          <div
            className="card shadow p-4 w-100"
            style={{ maxWidth: "500px", backgroundColor: "#fff" }}
          >
            <h3 className="text-center mb-4 text-primary">Contact Support</h3>
            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-3"
                placeholder="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-3"
                type="email"
                placeholder="Your Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <textarea
                className="form-control mb-3"
                placeholder="Your Message"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
              <button className="btn btn-primary w-100" type="submit">
                Send
              </button>
            </form>
            {status && (
              <p className="mt-3 text-center text-success fw-bold">{status}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSupport;
