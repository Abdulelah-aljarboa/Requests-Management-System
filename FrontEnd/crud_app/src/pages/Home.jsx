import React from 'react'
import { Link } from 'react-router-dom'
import "./styles/styles.css"
const Home = () => {
  return (
      <div className="home-container">
      <h1>Welcome to Request Management System</h1>
      <p>Please sign in or sign up to get started.</p>

      <div className="home-buttons">
        <Link to="/signin" className="home-button">
          Sign In
        </Link>
        <Link to="/signup" className="home-button">
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default Home
