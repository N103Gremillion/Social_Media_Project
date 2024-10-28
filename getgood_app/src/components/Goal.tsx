import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import './styles/Goal.css'
import "bootstrap/dist/css/bootstrap.min.css";

export interface RawGoalProps {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  userId: number
}

export interface GoalProps {
  id : number | null,
  name: string; 
  description: string;
  startDate: Date;
  endDate: Date; 
  userId: number; 
  onRemoveGoal?: (goalId: number) => void; 
}

const PORT = 4000;

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
    
    fetch(`http://localhost:${PORT}/deleteGoal`, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body:  JSON.stringify({
        userId: userId,
        goalId: goalId,
      }),
    })
    .then(response => {
      if (response.ok) {
        //alert('Goal deleted successfully!');
        setShowModal(false);
        if (goalId !== null && props.onRemoveGoal) {
          props.onRemoveGoal(goalId)
        }
        navigate('/dashboard/my-goals');
      } else {
        return response.json().then(err => { throw err; });
      }
    })
    .catch(error => {
      if (error.code === 'ER_LOCK_DEADLOCK') {
        setTimeout(() => handleConfirmDelete(), 200);
      } else {
        console.error('Error deleting goal:', error);
      alert('An error occured: ' + error.message); 
      }
      
    })

    setShowModal(false);
  };

  const handleEdit = () => {
    const goalData = { name, description, startDate, endDate, onRemoveGoal: undefined }; 
    console.log("Navigating with goal:", goalData)
    sessionStorage.setItem('editing', 'true');
    sessionStorage.setItem('pastGoalID', `${goalId}`);
    navigate('/dashboard/create-goal', { state: goalData });
  };

  const handleManage = () => {
    const goalData = { name, description, startDate, endDate, onRemoveGoal: undefined }; 
    console.log("Navigating with goal:", goalData)
    sessionStorage.setItem('goalId', `${props.id}`);
    navigate('/dashboard/edit-goal-progress', { state: goalData });
  }

  return (
    <>
      <div className="card">
        <div className="card-header">{name}</div>
        <div className="card-body">
          <h5 className="card-title">{description}</h5>
          <p className="card-text">{startDate.toLocaleDateString()}</p>
          <p className="card-text">{endDate.toLocaleDateString()}</p>
          <a href="#" className="btn btn-primary goal-button" onClick={handleManage}>
          Manage
          </a>
          <a href="#" className="btn btn-primary goal-button" onClick={handleEdit}>
          Edit
          </a>
          <a href="#" className="btn btn-primary goal-button" onClick={handleShowModal}>
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
