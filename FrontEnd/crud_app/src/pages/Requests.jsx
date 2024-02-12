import React, { useEffect, useState } from "react";
import axios from "./axios-config";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import "./styles/styles.css";
import Add from "./Add";
import Details from "./Details";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [addRequestModalOpen, setAddRequestModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:9000/requests");
        setRequests(res.data);
      } catch (err) {
        if (err.response.status === 401 || err.response.status === 403) {
          navigate("/");
        }
        console.log(err);
      }
    };
    fetchRequests();
  }, []);

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/requests/${id}`);
      window.location.reload();
    } catch (err) {
      if (err.response.status === 404) {
        window.location.reload();
      } else if (err.response.status === 401 || err.response.status === 403) {
        navigate("/");
      } else {
        console.log(err);
      }
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const toggleAddRequestModal = () => {
    setAddRequestModalOpen(!addRequestModalOpen);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:9000/requests/${id}`, {
        status: newStatus,
      });
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        window.location.reload();
      } else if (err.response.status === 401 || err.response.status === 403) {
        navigate("/");
      } else {
        console.log(err);
      }
    }
  };

  return (
    <div className="requests-container">
      <div className="table-header">
        <h1>Requests</h1>
        <button className="add-request-button" onClick={toggleAddRequestModal}>
          Add New Request
        </button>
      </div>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Creator</th>
            <th>Creation Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.title}</td>
              <td>{`${request.description.slice(0, 10)}${
                request.description.length > 10 ? "..." : ""
              }`}</td>
              <td>
                <select
                  className="status"
                  value={request.status}
                  onChange={(e) =>
                    handleStatusChange(request.id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In-progress">In-progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>{request.creator}</td>
              <td>{request.creation_date.slice(0, 10)}</td>
              <td className="actions">
                <div className="button-container">
                  <button
                    className="details"
                    onClick={() => openModal(request)}
                  >
                    Details
                  </button>
                </div>
                <div className="button-container">
                  <button
                    className="delete "
                    onClick={() => deleteRequest(request.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRequest && (
        <Modal onClose={closeModal}>
          <Details selectedRequest={selectedRequest} />
        </Modal>
      )}

      {addRequestModalOpen && (
        <Modal onClose={toggleAddRequestModal}>
          <Add closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default Requests;
