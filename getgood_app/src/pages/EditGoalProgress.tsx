import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Node, Position } from 'reactflow';
import { Checkpoint, updateCheckpointIDs, updateCheckpointPositions, updateEdges } from '../components/goalFunctions';
import 'reactflow/dist/style.css';

const EditGoalProgess = () => {
    const userId = sessionStorage.getItem('userId');
    const goalId = sessionStorage.getItem('goalId');



    return (<></>);
}



export default EditGoalProgess;