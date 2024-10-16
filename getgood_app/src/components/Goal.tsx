import React, { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import "bootstrap/dist/css/bootstrap.min.css";

export interface GoalProps {
  name: string; 
  description: string;
  startDate: string;
  endDate: string; 
}
const Goal: React.FC<GoalProps> = (props) => {
  const {
    name="Cool Goal", 
    description="This goal is radical B)", 
    startDate="04/20/1969",
    endDate="04/20/2020", 
  } = props; 

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
        <div className="card-header">{name}</div>
        <div className="card-body">
          <h5 className="card-title">{description}</h5>
          <p className="card-text">{startDate}</p>
          <p className="card-text">{endDate}</p>
          <a href="#" className="btn btn-primary">
            Manage
          </a>
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
