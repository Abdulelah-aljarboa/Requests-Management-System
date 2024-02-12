import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from './axios-config';
import "./styles/styles.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [signInSuccess, setSignInSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9000/signin",
        formData
      );

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setSignInSuccess(true);
        setErrorMessage("");
        setTimeout(() => {
          navigate("/requests");
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      setSignInSuccess(false);
      setErrorMessage("Invalid email or password");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign In</button>

        {signInSuccess && (
          <div className="success-message">
            <p>Sign-in successful! Redirecting...</p>
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        <p>
          Don't have an account?{" "}
          <Link className="signup-link" to="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
