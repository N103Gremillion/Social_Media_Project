import React, { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import "bootstrap/dist/css/bootstrap.min.css";

function Goal() {
  const [showModal, setShowModal] = useState(false);

  // Show modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    //api call to delete from DB here

    console.log("Goal deleted");
    setShowModal(false);
  };
  return (
    <>
      <div className="card">
        <div className="card-header">Goal</div>
        <div className="card-body">
          <h5 className="card-title">Some descriptor of the goal.</h5>
          <p className="card-text">Even more descriptions of goal.</p>
          <a href="#" className="btn btn-primary">
            Edit
          </a>
          <a href="#" className="btn btn-primary" onClick={handleShowModal}>
            Delete
          </a>
        </div>
      </div>
      <DeleteConfirmationModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default Goal;
