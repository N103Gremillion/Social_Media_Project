import React, { useState,useEffect } from 'react';
import ReactFlow, { addEdge } from 'reactflow';
import AddCheckpointModal from '../components/AddCheckpointModal';
import { Button } from 'react-bootstrap';
import 'reactflow/dist/style.css';

interface Position {
  x: number;
  y: number;
}

interface NodeData {
  label: string;
}

interface Node {
  id: string;
  position: Position;
  data: NodeData;
  sourcePosition: string;
  targetPosition: string;
  date: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
}

const CreateGoalPage = () => {
  const port = 3231;
  const [goalName, setGoalName] = useState<string>('');
  const [goalDescription, setGoalDescription] = useState<string>('');
  const [goalStartDate, setGoalStartDate] = useState<string>('');
  const [goalEndDate, setGoalEndDate] = useState<string>('');
  const [checkpoints, setCheckpoints] = useState<any>([]);
  const [newCheckpointName, setNewCheckpointName] = useState<string>('');
  const [newCheckpointDate, setNewCheckpointDate] = useState<string>('');
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);

  const userId = 1;

  const clearGoalFields = () => {
    setGoalName('');
    setGoalDescription('');
    setGoalStartDate('');
    setGoalEndDate('');
  };

  const clearCheckpointFields = () => {
    setNewCheckpointName('');
    setNewCheckpointDate('');
  };

  let [nodes, setNodes] = useState<any>([
    { id: '1', position: { x: 50, y: 20 }, data: { label: 'Start' }, sourcePosition: 'right', targetPosition: 'left', date: "01-01-1500" },
    { id: '2', position: { x: 250, y: 20 }, data: { label: 'End' }, sourcePosition: 'right', targetPosition: 'left', date: '01-01-9999' }
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { id: '1-2', source: '1', target: '2', type: 'straight' }
  ]);

  const updateCheckpointIDs = (oldCheckpoints: Node[]) => {
    const newCheckpoints: Node[] = Array.from(oldCheckpoints);
    for (let i=0; i<oldCheckpoints.length; i++) {
      newCheckpoints[i].id = `${i+1}`;
    }
    return newCheckpoints;
  };

  const updateCheckpointPositions = (nodes: any[]) => {
    const newNodes: any[] = Array.from(nodes);
    for (let i=0; i<newNodes.length; i++) {
      newNodes[i].position.x = 50 + 200*i;
    }
    return newNodes;
  }

  const updateEdges = (checkpoints: Node[]) => {
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

  const printEdges =  (edges: Edge[]) => {
    console.log("printing edges");
    for (let i=0;i<edges.length;i++) {
      console.log(`id: ${edges[i].id} source: ${edges[i].source} target: ${edges[i].target}`);
    }
    console.log();
  };

  const addCheckpointNode = () => {
    if (!newCheckpointDate || !newCheckpointName) {
      return;
    }

    let length = nodes.length;
    let lastNode = nodes[length - 1]; // Get the last node

    // Create a new checkpoint node
    const newNode = {
      id: (length + 1).toString(), // Generate a new unique id
      position: { x: lastNode.position.x + 200, y: lastNode.position.y }, // Position it based on the last node
      data: { label: newCheckpointName },
      sourcePosition: 'right',
      targetPosition: 'left',
      date: newCheckpointDate
    };

    // Append the new node to the existing array
    setNodes((nodes: any) => [...nodes, newNode]);
    sortnodes();
    setNodes((nodes: any) => updateCheckpointIDs(nodes));
    setNodes((nodes: any) => updateCheckpointPositions(nodes));
    
    clearCheckpointFields();
    
    
  };

  useEffect(() => {
    setEdges(updateEdges(nodes));
  }, [nodes]);

  const printNodes = () => {
    console.log("printing nodes")
    for (let i=0; i<nodes.length;i++) {
      console.log(`id: ${nodes[i].id}  name: ${nodes[i].data.label}`);
    }
    console.log('\n');
  }

  const sortnodes = () => {
    setNodes((nodes: any) => [...nodes].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }

  const createGoal = async () => {
    const goalInfo = {
      userId,
      goalName,
      goalDescription,
      goalStartDate,
      goalEndDate
    };

    try {
      const response = await fetch('http://localhost:3231/addGoal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalInfo),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        addCheckpointsToDataBase(result.id);
      }else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }

    clearGoalFields();
    setCheckpoints([]);
  }

  const addCheckpointsToDataBase = async (goalId: any) => {
    for (const checkpoint of checkpoints) {
      addCheckpointToDataBase(checkpoint, goalId);
    }
  };

  const addCheckpointToDataBase = async (checkpoint: Checkpoint, goalId: any) => {
    const name = checkpoint.checkpointName;
    const date = checkpoint.checkpointDate;

    try {
      const response = await fetch('http://localhost:3231/addCheckpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, date, goalId}),
      });

      if (response.ok) {
        console.log("success");
      }else {
        console.error(response.statusText);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const CreatGoalPageStyle: React.CSSProperties = {
    backgroundColor: 'lightyellow',
    width: '95%',
    height: '100vh',
    // padding: '20px',
    textAlign: 'center',
    // make the items in div vertially align
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
    <div className="CreateGoal" style={CreatGoalPageStyle}>
      <h1>Create A Goal</h1>
        <div className='goal-name'>
          <h3>Name:</h3>
          <input
              type="text"
              id="goal-name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="Enter your goal name"
            />
        </div>

        <div className="goal-descriotion">
          <h3>Description:</h3>
          <textarea
            id="goal-description"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            placeholder="Enter a description of your goal"
          />
        </div>
      

        <div className="start-end-dates">
          <h3>Length:</h3> 
          <p>From</p>
          <input
            type="date"
            value={goalStartDate}
            onChange={(e) => setGoalStartDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
          <p>to</p>
          <input
            type="date"
            value={goalEndDate}
            onChange={(e) => setGoalEndDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
          <div className="checkpoint-display" >
            <h2>Checkpoints:</h2>
            <div style={{ width: '1000px', overflowX: 'auto'}}>
              <div 
                style={{display: 'flex', height: '10vh', 
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
                  />
              </div>
            </div>
          </div>
        </div>

        <div className="checkpoint-form">
          <button onClick={() => setIsCheckpointModalOpen(true)}>Add Checkpoint</button>
          <AddCheckpointModal
            isOpen={isCheckpointModalOpen}
            close={() => {setIsCheckpointModalOpen(false)}}
            checkpointName={newCheckpointName}
            setCheckpointName={setNewCheckpointName}
            checkpointDate={newCheckpointDate}
            setCheckpointDate={setNewCheckpointDate}
            addCheckpoint={addCheckpointNode}
          />
        </div>

        <div className='create-goal'>
          <p><button onClick={createGoal}>Create Goal</button></p>
        </div>

        
    </div>
  );
}

export default CreateGoalPage;