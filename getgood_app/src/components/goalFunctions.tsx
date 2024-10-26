import { Edge, Node, Position } from 'reactflow';
import React, { useState } from 'react';

interface NodeData {
    label: string;
    date: string
  }
  
export interface Checkpoint extends Node<NodeData> {}

export const beginningNodes: Checkpoint[] = [
  { id: '1', position: { x: 50, y: 20 }, data: { label: 'Start', date: "01-01-01" }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: '2', position: { x: 250, y: 20 }, data: { label: 'End', date: '01-01-99999' }, sourcePosition: Position.Right, targetPosition: Position.Left }
];

export const beginningEdges: Edge[] = [{ id: '1-2', source: '1', target: '2', type: 'straight' }];

export const updateCheckpointIDs = (oldCheckpoints: Node[]) => {
    const newCheckpoints: Node[] = Array.from(oldCheckpoints);
    for (let i=0; i<oldCheckpoints.length; i++) {
        newCheckpoints[i].id = `${i+1}`;
    }
    return newCheckpoints;
};

export const updateCheckpointPositions = (nodes: Node[]) => {
    const newNodes: Node[] = Array.from(nodes);
    for (let i=0; i<newNodes.length; i++) {
        newNodes[i].position.x = 50 + 200*i;
    }
return newNodes;
}

export const updateEdges = (checkpoints: Node[]) => {
    const newEdges: Edge[] = [];

    for (let i=0; i<checkpoints.length-1;i++) {

        let start: Node = checkpoints[i];
        let end: Node = checkpoints[i+1];

        const newEdge = {
        id: `${start.id}-${end.id}`,
        source: `${start.id}`,
        target: `${end.id}`,
        type: 'straight'
        }
        newEdges.push(newEdge);
    }
    return newEdges;
}

export const sortnodes = (nodes: Node[]) => {
    return ([...nodes].sort((a,b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()));
}

export const addCheckpointNode = (nodes: Node[], newCheckpointDate: string, newCheckpointName: string, setNodes: React.Dispatch<React.SetStateAction<Checkpoint[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>) => {
    if (!newCheckpointDate || !newCheckpointName) {
      return;
    }

    let length = nodes.length;
    let lastNode = nodes[length - 1]; // Get the last node

    // Create a new checkpoint node
    const newNode = {
      id: (length + 1).toString(), // Generate a new unique id
      position: { x: lastNode.position.x + 200, y: lastNode.position.y }, // Position it based on the last node
      data: { label: newCheckpointName, date: newCheckpointDate },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      
    };

    setNodes((nodes: Node[]) => {
      const addedNode = [...nodes, newNode];
      const sortedNodes = sortnodes(addedNode);
      const idUpdatedNodes = updateCheckpointIDs(sortedNodes);
      const positionUpdatedNodes = updateCheckpointPositions(idUpdatedNodes);
      setEdges(updateEdges(positionUpdatedNodes));
      return positionUpdatedNodes;
    })
    
    
  };

