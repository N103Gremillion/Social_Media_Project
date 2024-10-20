import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import "bootstrap/dist/css/bootstrap.min.css";

export interface GoalProps {
  id : number
  name: string; 
  description: string;
  startDate: string;
  endDate: string; 
}
const Goal: React.FC<GoalProps> = (props) => {
  const {
    name, 
    description, 
    startDate,
    endDate, 
  } = props; 

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

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

  const handleEdit = () => {
    navigate('/Dashboard/create-goal', {
      state: { name, description, startDate, endDate }
    });
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
          <a href="#" className="btn btn-primary" onClick={handleEdit}>
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
