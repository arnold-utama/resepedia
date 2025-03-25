import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { api } from "../helpers/http-client";

export default function LoginPage() {
  const access_token = localStorage.getItem("access_token");

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (access_token) {
    return <Navigate to={"/"} />;
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      navigate("/");
    } catch (error) {
      console.log("🚀 ~ handleLogin ~ error:", error);
      if (error.response?.data?.message) {
        window.Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,
        });
      }
    }
  }

  return (
    <div className="d-flex flex-grow-1">
      <div className="w-50 form-bg d-flex justify-content-center align-items-center">
        <form className="form w-100 p-5" onSubmit={handleLogin}>
          <div className="mb-4">
            <h1 className="fw-bold">Login to your account</h1>
            <h6>Welcome back!</h6>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              u
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-danger mt-4 w-100">
            Login
          </button>
          <p className="text-center mt-3">
            Don't have account?{" "}
            <Link to={"/register"} className="text-danger">
              Create an account
            </Link>
          </p>
        </form>
      </div>
      <div className="w-50 cooking-bg"></div>
    </div>
  );
}
