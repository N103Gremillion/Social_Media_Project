import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Node, Position } from 'reactflow';
import 'reactflow/dist/style.css';

interface NodeData {
    label: string;
    date: string
}
  
interface Checkpoint extends Node<NodeData> {}

const EditGoalProgess = () => {
    const userId = sessionStorage.getItem('userId');
    const goalId = sessionStorage.getItem('goalId');

    

    return (<></>);
}



export default EditGoalProgess;