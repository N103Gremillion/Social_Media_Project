import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Position } from 'reactflow';
import { Checkpoint, updateEdges, addCheckpointNode } from '../components/goalFunctions';
//import 'reactflow/dist/style.css';

const EditGoalProgess = () => {
    const PORT = 4000;
    const userId = 1;
    const goalId = sessionStorage.getItem('goalId');

    const beginningNodes: Checkpoint[] = [
      { id: '1', position: { x: 50, y: 20 }, data: { label: 'Start', date: "01-01-01" }, sourcePosition: Position.Right, targetPosition: Position.Left },
      { id: '2', position: { x: 250, y: 20 }, data: { label: 'End', date: '01-01-99999' }, sourcePosition: Position.Right, targetPosition: Position.Left }
    ];
    const beginningEdges: Edge[] = [{ id: '1-2', source: '1', target: '2', type: 'straight' }];

    const [nodes, setNodes] = useState<Checkpoint[]>(beginningNodes);
    const [edges, setEdges] = useState<Edge[]>(beginningEdges);

    const addCheckpoints = (nodes: Checkpoint[], newNodes: any) => {
      console.log("newnodes: ", newNodes);
      for (let i=0; i < newNodes.length; i++) {
        addCheckpointNode(nodes, newNodes[i].date, newNodes[i].name, setNodes, setEdges);
      }
      
    }

    const getCheckpoints = async () => {

      try {
        const goalInfo = {
            userId: userId,
            goalId: goalId
        };
        const response = await fetch(`http://localhost:${PORT}/getCheckpoints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalInfo),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('result', result, result.checkpoints[0], goalId);
          return result.checkpoints;
        }else {
          console.error(response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      const fetchCheckpoints = async () => {
        const newCheckpoints = await getCheckpoints();
        if (newCheckpoints) {
          addCheckpoints(nodes, newCheckpoints);
          setEdges(updateEdges(nodes));
        }
      }
      console.log("here");
      fetchCheckpoints();
    }, []);

    const EditProgressPageStyle: React.CSSProperties = {
      backgroundColor: 'white',
      width: '95%',
      height: '100vh',
      textAlign: 'center',
      display: 'flex',
      alignItems:'center',
      justifyContent: 'space-evenly',
      flexDirection: 'column',
      position: 'fixed',
      marginLeft: '5vw',
      zIndex: '0', 
      overflowY: 'auto'   
    };

    return (
    <div className='Edit-Goal-Progress' style={EditProgressPageStyle}>
      <div className="checkpoint-display" style={{height: "90%"}} >
            <h2>Checkpoints:</h2>
            <div style={{ width: '1000px', overflowX: 'auto'}}>
              <div 
                style={{display: 'flex', height: '100px', 
                width: `${Math.max(nodes.length * 500, 1000)}px`, 
                justifyContent: 'center', 
                whiteSpace: 'nowrap'}}>
                <ReactFlow 
                  nodes={nodes} 
                  edges={edges} 
                  nodesDraggable={false} 
                  panOnDrag = {false} 
                  fitView={true}
                  elevateNodesOnSelect={false}
                  elevateEdgesOnSelect={false}
                  edgesFocusable={false}
                  zoomOnDoubleClick={false}
                  zoomOnScroll={false}
                  zoomOnPinch={false}
                  connectOnClick={false}
                  />
              </div>
            </div>
          </div>
    </div>
    );
};



export default EditGoalProgess;