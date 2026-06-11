import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";



const ResetPassword = () => {
  const[hover, setHover] = useState(false);
  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");
    const otp = form.otp.trim();

    if(!email) return toast.error("Session expired. Please try again.");
    if (!/^\d{6}$/.test(otp)) return toast.error("Enter a valid 6 digit OTP");
    if (form.newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: form.newPassword,
      });

      toast.success("Password reset successful");

      localStorage.removeItem("resetEmail");

      navigate("/login");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen">
        <div className="left-panel hidden lg:flex lg:w-1/2  items-center justify-center p-12 bg-[#008cff] ">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "start",
              margin: "0 3rem",
              color: "#fff",
              padding: "0 2rem",
            }}
          >
            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: "bold",
                marginTop: "1.2rem",
                textAlign: "start",
              }}
            >
              You're just one step away from regaining access to your account.
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                marginTop: "0.5rem",
                color: "#f8f8ff",
                opacity: "0.8",
              }}
            >
              Please create a new password. Make sure it's strong and secure, combining letters, numbers, and special characters.
            </p>
          </div>
        </div>
        <div className="right-panel flex w-full lg:w-1/2 items-center justify-center p-12">
          <div
            style={{
              width: "100%",
              maxWidth: "28rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
          <div className="border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center">
            <KeyRound size={32}/>
          </div>
            <div className="text-center lg:text-left ">
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                Set new password
              </h2>
              <p>Must be at least 8 characters.</p>
            </div>

            <div>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  <input
                    name="otp"
                    placeholder="Enter OTP"
                    value={form.otp}
                    inputMode="numeric"
                    maxLength={6}
                    onChange={handleChange}
                    style={{
                      border: "1px solid #959597",
                      borderRadius: "0.5rem",
                      padding: "0.4rem",
                      outline: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      transform: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={form.newPassword}
                    onChange={handleChange}
                    style={{
                      border: "1px solid #959597",
                      borderRadius: "0.5rem",
                      padding: "0.4rem",
                      outline: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      transform: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{
                      border: "1px solid #959597",
                      borderRadius: "0.5rem",
                      padding: "0.4rem",
                      outline: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      transform: "none",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    border: "1px solid ",
                    borderRadius: "0.5rem",
                    padding: "0.4rem",
                    outline: "none",
                    boxShadow: "none",
                    backgroundColor: "#008cff",
                    color: "#ffffff",
                    fontWeight: "500",
                    justifyContent: "center",
                    transform: hover ? "scale(1.01)" : "scale(1)",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-500">
                Didn't get an OTP?{" "}
                <Link to="/forgot-password" className="font-medium text-[#008cff]">
                  Request a new one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword
