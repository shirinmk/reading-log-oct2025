// src/pages/SignupParent.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    accessCode: "",
    role: "parent",
     schoolCode: ""    // school-specific code
  });
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
// console.log("API_BASE is:", process.env.REACT_APP_API_URL);

  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErr("");
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if ((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
      newErrors.email = "Invalid email format.";
    }
    if (formData.confirmEmail !== formData.email) {
      newErrors.confirmEmail = "Emails do not match.";
    }
    if (formData.phone && !(/^\+?[0-9]{10,15}$/.test(formData.phone))) {
      newErrors.phone = "Phone must be 10–15 digits, optionally with +.";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.accessCode.trim()) {
      newErrors.accessCode = "Access code is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!validateForm()) {
      return;
    }
// console.log(`${ API_BASE}/api/auth/register`);
    try {
      await axios.post(`${ API_BASE}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username || undefined,
        email: formData.email,
        confirmEmail: formData.confirmEmail,
        phone: formData.phone || undefined,
        password: formData.password,
        accessCode: formData.accessCode,
        role: "parent",
        schoolCode: formData.schoolCode,   // ✅ add this
      });

      setShowModal(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to register";
      setErr(msg);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/sign-in");
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#fce8d5", minHeight: "100vh" }}>
        <div className="d-flex justify-content-center align-items-center py-5 px-3 px-md-0">
          <div className="text-center" style={{ maxWidth: 520, width: "100%" }}>
            <h1 className="h3 mt-5 mb-3">Register For Reading Olympiad</h1>
            <h3>Parent Information</h3>

            {err && (
              <div className="alert alert-danger mt-3" role="alert">
                {err}
              </div>
            )}

            <form className="form-signin text-start mt-3" onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="form-group mb-3">
                <label htmlFor="inputFirstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="inputFirstName"
                  name="firstName"
                  className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstNameError" : undefined}
                />
                {errors.firstName && (
                  <div id="firstNameError" className="invalid-feedback">
                    {errors.firstName}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group mb-3">
                <label htmlFor="inputLastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="inputLastName"
                  name="lastName"
                  className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastNameError" : undefined}
                />
                {errors.lastName && (
                  <div id="lastNameError" className="invalid-feedback">
                    {errors.lastName}
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="form-group mb-3">
                <label htmlFor="inputUserName" className="form-label">Username (required)</label>
                <input
                  type="text"
                  id="inputUserName"
                  name="username"
                  className="form-control"
                  placeholder="Username (required)"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="form-group mb-3">
                <label htmlFor="inputEmail" className="form-label">Email</label>
                <input
                  type="email"
                  id="inputEmail"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "emailError" : undefined}
                />
                {errors.email && (
                  <div id="emailError" className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Confirm Email */}
              <div className="form-group mb-3">
                <label htmlFor="inputConfirmEmail" className="form-label">Confirm Email</label>
                <input
                  type="email"
                  id="inputConfirmEmail"
                  name="confirmEmail"
                  className={`form-control ${errors.confirmEmail ? "is-invalid" : ""}`}
                  placeholder="Confirm Email"
                  required
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  aria-invalid={!!errors.confirmEmail}
                  aria-describedby={errors.confirmEmail ? "confirmEmailError" : undefined}
                />
                {errors.confirmEmail && (
                  <div id="confirmEmailError" className="invalid-feedback">
                    {errors.confirmEmail}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="form-group mb-3">
                <label htmlFor="phone" className="form-label">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Phone (optional)"
                  pattern="^\+?[0-9]{10,15}$"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phoneError" : "phoneHelp"}
                />
                <small id="phoneHelp" className="text-muted">
                  Enter as 1234567890 or +11234567890 (10–15 digits).
                </small>
                {errors.phone && (
                  <div id="phoneError" className="invalid-feedback">
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="form-group mb-3">
                <label htmlFor="inputPassword" className="form-label">Password</label>
                <input
                  type="password"
                  id="inputPassword"
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "passwordError" : undefined}
                />
                {errors.password && (
                  <div id="passwordError" className="invalid-feedback">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Access Code */}
              <div className="form-group mb-4">
                <label htmlFor="accessCode" className="form-label">Access Code</label>
                <input
                  type="text"
                  id="accessCode"
                  name="accessCode"
                  className={`form-control ${errors.accessCode ? "is-invalid" : ""}`}
                  placeholder="Access Code"
                  required
                  value={formData.accessCode}
                  onChange={handleChange}
                  aria-invalid={!!errors.accessCode}
                  aria-describedby={errors.accessCode ? "accessCodeError" : "accessCodeHelp"}
                />
                <small id="accessCodeHelp" className="text-muted">
                  Ask your school/teacher for the sign-up code.
                </small>
                {errors.accessCode && (
                  <div id="accessCodeError" className="invalid-feedback">
                    {errors.accessCode}
                  </div>
                )}
              </div>
              <div className="mb-3">
  <label className="form-label">School Code</label>
  <input
    type="text"
    name="schoolCode"
    value={formData.schoolCode}
    onChange={handleChange}
    className="form-control"
    required
  />
</div>


              <input type="hidden" name="role" value="parent" />

              <button className="btn btn-lg btn-primary w-100" type="submit">
                Sign Up
              </button>
            </form>

            {/* Success Modal */}
            {showModal && (
              <>
                <div className="modal-backdrop fade show"></div>
                <div
                  className="modal show fade d-block"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="registrationSuccessTitle"
                  aria-modal="true"
                >
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 id="registrationSuccessTitle" className="modal-title">
                          Registration Complete
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Your account was created successfully. Please sign in.</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                          Go to Sign In
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
