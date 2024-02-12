import React from "react";

const Details = ({ selectedRequest }) => {
  return (
    <div>
      <div className="form">
        <h1>Request Details</h1>
        <label>Title:</label>
        <p>{selectedRequest.title}</p>
        <label>Description:</label>
        <p>{selectedRequest.description}</p>
        <label>Status:</label>
        <p>{selectedRequest.status}</p>
        <label>Creator:</label>
        <p>{selectedRequest.creator}</p>
        <label>Creation Date:</label>
        <p>{selectedRequest.creation_date.slice(0, 10)}</p>
      </div>
    </div>
  );
};

export default Details;
