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
  userId: number; 
  onRemoveGoal: (goalId: number) => void; 
}
const Goal: React.FC<GoalProps> = (props) => {
  const {
    id: goalId,
    name, 
    description, 
    startDate,
    endDate, 
    userId
  } = props; 

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting goalId:", goalId); 
    console.log("For userId:", userId); 
    
    fetch("http://localhost:3231/deleteGoal", {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body:  JSON.stringify({
        userId: userId,
        goalId: goalId,
      }),
    })
    .then(response => {
      if (response.ok) {
        alert('Goal deleted successfully!');
        setShowModal(false);
        navigate('/Dashboard/my-goals');
      } else {
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'Failed to delete goal.'); 
        });
      }
    })
    .catch(error => {
      console.error('Error deleting goal:', error);
      alert('An error occured: ' + error.message); 
    })

    
    setShowModal(false);
  };

  const handleEdit = () => {
    navigate('/Dashboard/create-goal', {
      state: { name, description, startDate, endDate }
    });
  };

  const handleManage = () => {
    navigate('/Dashboard/manage-goal', {
      state: { name, description, startDate, endDate }
    });
  }

  return (
    <>
      <div className="card">
        <div className="card-header">{name}</div>
        <div className="card-body">
          <h5 className="card-title">{description}</h5>
          <p className="card-text">{startDate}</p>
          <p className="card-text">{endDate}</p>
          <a href="#" className="btn btn-primary" onClick={handleManage}>
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
