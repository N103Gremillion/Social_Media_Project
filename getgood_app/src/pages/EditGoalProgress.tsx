import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Node, Position } from 'reactflow';
import { Checkpoint, updateCheckpointIDs, updateCheckpointPositions, updateEdges } from '../components/goalFunctions';
import 'reactflow/dist/style.css';

const EditGoalProgess = () => {
    const PORT = 3231;
    const userId = sessionStorage.getItem('userId');
    const goalId = sessionStorage.getItem('goalId');

    const getCheckpoints = async () => {
      try {
        const goalInfo = {
            userId: userId,
            goalId: goalId
        };
        const response = await fetch(`http://localhost:${PORT}/addGoal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalInfo),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log(result);
        }else {
          console.error(response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return (<></>);
};



export default EditGoalProgess;