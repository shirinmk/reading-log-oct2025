import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const AdminLogin = () => {
  const [emailOrUsername, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/login", { emailOrUsername, password });
      if (data.user?.role !== "admin") {
        setErr("This account is not an admin.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin/dashboard"); // <-- admin dashboard page
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div  style={{backgroundColor: "#fce8d5",minHeight: "100vh"}}>
    <div className="container" style={{ paddingTop: 80 }}>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h4 mb-3">Admin Sign In</h1>
              {err && <div className="alert alert-danger">{err}</div>}
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={emailOrUsername} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button className="btn btn-primary w-100">Sign In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminLogin;
