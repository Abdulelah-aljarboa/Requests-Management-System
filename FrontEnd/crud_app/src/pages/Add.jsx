import axios from './axios-config';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/styles.css";

const Add = ({ closeModal }) => {
  const [status, setStatus] = useState("Pending");
  const [request, setRequest] = useState({
    title: "",
    description: "",
    status: status,
    creator: "",
  });

  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const changeStatus = (event) => {
    const val = event.target.value;
    setStatus(val);
    setRequest((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const changeData = (event) => {
    setRequest((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    const { title, description } = request;
    return title.trim() !== "" && description.trim() !== "";
  };

  useEffect(() => {
    setButtonDisabled(!validateForm());
  }, [request]);

  const sendData = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        await axios.post("http://localhost:9000/requests", request);
        closeModal();
        window.location.reload();
      } catch (err) {
        if(err.response.status === 401 || err.response.status === 403) {
            navigate('/');
        }
        console.log(err);
      }
    } else {
      console.error("Please fill in all required fields.");
    }
  };

  return (
    <div>
      <h1>Add New Request !</h1>
      <div className="form">
        <label htmlFor="title">Title </label>
        <input
          type="text"
          placeholder="title"
          name="title"
          onChange={changeData}
        />
        <label htmlFor="description">Description </label>
        <input
          type="text"
          placeholder="description"
          name="description"
          onChange={changeData}
        />
        <label htmlFor="status">Status </label>
        <select name="status" value={status} onChange={changeStatus} required>
          <option value="Pending">Pending</option>
          <option value="In-progress">In-progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button
        className="add-request-modal-button"
        onClick={sendData}
        disabled={isButtonDisabled}
      >
        ADD
      </button>
    </div>
  );
};

export default Add;
