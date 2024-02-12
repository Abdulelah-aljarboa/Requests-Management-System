import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from './axios-config';
import './styles/styles.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
  });

  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9000/signup", formData);
      setShowCheckmark(true);
      setTimeout(() => {
        navigate('/signin');
      }, 2000); 
    } catch (err) {
      console.log(err);
    }
    console.log('Sign Up:', formData);
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {!showCheckmark ? (
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>User Name:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />

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

          <button type="submit">Sign Up</button>

          <p>
            Already have an account?{' '}
            <Link className="signin-link" to="/signin">
              Sign In
            </Link>
          </p>
        </form>
      ) : (
        <div className="checkmark-container">
          <span className="checkmark">&#10003;</span>
          <p>Sign up successful! Redirecting to Sign In...</p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
