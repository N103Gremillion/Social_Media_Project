import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Position } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import { Checkpoint, updateEdges, addCheckpointNode } from '../components/goalFunctions';
import { addCheckpointsToDataBase, deleteCheckpointsFromDataBase } from '../components/databaseFunctions';
//import 'reactflow/dist/style.css';

const EditGoalProgess = () => {
    const PORT = 4000;
    const userId = sessionStorage.getItem('userID');
    const goalId = sessionStorage.getItem('goalId');
    const navigate = useNavigate();
    let [modifiedList, setModifiedList] = useState<boolean>(false);
    

    

    const beginningNodes: Checkpoint[] = [
      { id: '1', position: { x: 50, y: 0 }, data: { label: 'Start', date: "01-01-01", completed: true }, sourcePosition: Position.Bottom },
      { id: '2', position: { x: 50, y: 200 }, data: { label: 'End', date: '01-01-99999', completed: false }, targetPosition: Position.Top }
    ];
    const beginningEdges: Edge[] = [{ id: '1-2', source: '1', target: '2', type: 'straight' }];

    const [nodes, setNodes] = useState<Checkpoint[]>(beginningNodes);
    const [edges, setEdges] = useState<Edge[]>(beginningEdges);

    const addCheckpoints = (nodes: Checkpoint[], newNodes: any) => {
      for (let i=0; i < newNodes.length; i++) {
        addCheckpointNode(nodes, newNodes[i].date, newNodes[i].name, (newNodes[i].completed == "1"), setNodes, setEdges);
      }
      
    }
    useEffect(() => {
      
      const fetchCheckpoints = async () => {
        
        const newCheckpoints = await getCheckpoints();
        if (newCheckpoints) {
          setModifiedList(true);
          addCheckpoints(nodes, newCheckpoints);
          setEdges(updateEdges(nodes));
          
        }
      }
      fetchCheckpoints();      
    }, []);

    useEffect(() => {
      if (modifiedList) {
        setModifiedList(false);
        const newNodes = markCompletionDisplay(nodes);
        setNodes(newNodes);
      }
    }, [nodes])

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
          return result;
        }else {
          console.error(response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    }

    const markCompletionDisplay = (oldNodes: Checkpoint[]) => {
      const currentTime = new Date().getTime();
      const newNodes = [ ...oldNodes ];

      for (let i=0; i<oldNodes.length; i++) {
        let nodeTime = new Date(oldNodes[i].data.date).getTime();

        if (currentTime > nodeTime && !oldNodes[i].data.completed) {
          newNodes[i].style = { border: '3px dashed red' };
          
        } else if (oldNodes[i].data.completed) {
          newNodes[i].style = { border: '3px solid green' };
        } else {
          newNodes[i].style = { border: '1px solid black' };
        }
      }
      return newNodes;
    }

    
    const handeCheckpointClick = (event: React.MouseEvent, node: Checkpoint) => {
      if (node.id === '1') {
        event.stopPropagation();
        return;
      }

      const newNodes = [ ...nodes ];
      const nodeIndex = parseInt(node.id)-1;
      newNodes[nodeIndex].data.completed = newNodes[nodeIndex].data.completed ? false : true;

      setModifiedList(true);
      setNodes(newNodes);
      
    }

    const handleCheckpointsSave = () => {
      let goalId = sessionStorage.getItem('goalId');
      if (goalId) {
        deleteCheckpointsFromDataBase(PORT, goalId);
        addCheckpointsToDataBase(goalId, PORT, nodes);
        navigate('/dashboard/my-goals');
      }
      
    }

    const handleCancel = () => {
      navigate('/dashboard/my-goals');
    }
  

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
        <h2>Edit Checkpoint Progress:</h2>
        <div style={{ width: '400px', height: '550px', overflowY: 'scroll', overflowX: 'hidden'}}>
          <div 
            style={{display: 'flex', 
            height: `${Math.max(nodes.length * 200, 400)}px`, 
            width: `390px`, 
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
              minZoom={100}
              zoomOnDoubleClick={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              connectOnClick={false}
              onNodeClick={handeCheckpointClick}
              />
          </div>
        </div>
      </div>
      <div className='buttons'>
        <button onClick={handleCheckpointsSave}>Save Progress</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
    );
};



export default EditGoalProgess;