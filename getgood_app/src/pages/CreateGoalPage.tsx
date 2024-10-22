import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Node, Position } from 'reactflow';
import AddCheckpointModal from '../components/AddCheckpointModal';
import EditCheckpointModal from '../components/EditCheckpointModal';
import 'reactflow/dist/style.css';

interface NodeData {
  label: string;
  date: string
}

interface Checkpoint extends Node<NodeData> {}

const CreateGoalPage = () => {
  const [goalName, setGoalName] = useState<string>('');
  const [goalDescription, setGoalDescription] = useState<string>('');
  const [goalStartDate, setGoalStartDate] = useState<string>('');
  const [goalEndDate, setGoalEndDate] = useState<string>('');
  const [checkpoints, setCheckpoints] = useState<any>([]);
  const [newCheckpointName, setNewCheckpointName] = useState<string>('');
  const [newCheckpointDate, setNewCheckpointDate] = useState<string>('');
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [isEditCheckpointModalOpen, setIsEditCheckpointModalOpen] = useState(false);
  let [currentCheckpoint, setcurrentCheckpoint] = useState<Node>();

  const userId = 1;
  const PORT = 4000;

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

  let beginningNodes: Checkpoint[] = [
    { id: '1', position: { x: 50, y: 20 }, data: { label: 'Start', date: "01-01-01" }, sourcePosition: Position.Right, targetPosition: Position.Left },
    { id: '2', position: { x: 250, y: 20 }, data: { label: 'End', date: '01-01-99999' }, sourcePosition: Position.Right, targetPosition: Position.Left }
  ];

  let [nodes, setNodes] = useState<Checkpoint[]>(beginningNodes);

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

  const updateCheckpointPositions = (nodes: Node[]) => {
    const newNodes: Node[] = Array.from(nodes);
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
      data: { label: newCheckpointName, date: newCheckpointDate },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      
    };

    // Append the new node to the existing array
    setNodes((nodes: Node[]) => [...nodes, newNode]);
    sortnodes();
    setNodes((nodes: Node[]) => updateCheckpointIDs(nodes));
    setNodes((nodes: Node[]) => updateCheckpointPositions(nodes));
    
    clearCheckpointFields();
    
    
  };

  useEffect(() => {
    setEdges(updateEdges(nodes));
  }, [nodes]);

  const sortnodes = () => {
    setNodes((nodes: Node[]) => [...nodes].sort((a,b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()));
  }

  const handeCheckpointClick = (event: React.MouseEvent, node: Node) => {
    setcurrentCheckpoint(node);
    setNewCheckpointName(node.data.label);
    setNewCheckpointDate(node.data.date);
    setIsEditCheckpointModalOpen(true);
  }

  const saveCheckpoint = () => {
    if (currentCheckpoint == null) {
      console.log("it is null");
      return;
    }
    let replaceIndex = currentCheckpoint.id;
    let newNode: Node = {...currentCheckpoint};
    newNode.data.label = newCheckpointName;
    newNode.data.date = newCheckpointDate;

    const newNodes = nodes.filter(node => node.id == replaceIndex ? newNode : node);
    setNodes(newNodes);
    sortnodes();
    setNodes((nodes: Node[]) => updateCheckpointIDs(nodes));
    setNodes((nodes: Node[]) => updateCheckpointPositions(nodes));
  }

  const deleteCheckpoint = () => {
    if (currentCheckpoint == null) {
      return;
    }

    let deleteId = currentCheckpoint.id;
    const newNodes: Node[] = nodes.filter(node => node.id != deleteId);

    setNodes(newNodes);
    sortnodes();
    setNodes((nodes: Node[]) => updateCheckpointIDs(nodes));
    setNodes((nodes: Node[]) => updateCheckpointPositions(nodes));
    
    clearCheckpointFields();
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
      const response = await fetch(`http://localhost:${PORT}/addGoal`, {
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
    setNodes(beginningNodes);
  }

  const addCheckpointsToDataBase = async (goalId: string) => {
    for (let i=1; i<nodes.length-1; i++) {
      addCheckpointToDataBase(nodes[i], goalId);
    }
  };

  const addCheckpointToDataBase = async (checkpoint: Node, goalId: string) => {
    const name = checkpoint.data.label;
    const date = checkpoint.data.date;

    try {
      const response = await fetch(`http://localhost:${PORT}/addCheckpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, date, goalId}),
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

  const CreatGoalPageStyle: React.CSSProperties = {
    backgroundColor: 'lightyellow',
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
                  connectOnClick={false}
                  onNodeClick={handeCheckpointClick}
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
            clearCheckpointFields={clearCheckpointFields}
          />
          <EditCheckpointModal
            isOpen={isEditCheckpointModalOpen}
            close={() => {setIsEditCheckpointModalOpen(false)}}
            checkpointName={newCheckpointName}
            setCheckpointName={setNewCheckpointName}
            checkpointDate={newCheckpointDate}
            setCheckpointDate={setNewCheckpointDate}
            saveChanges={saveCheckpoint}
            deleteCheckpoint={deleteCheckpoint}
            clearCheckpointFields={clearCheckpointFields}
          />
        </div>

        <div className='create-goal'>
          <p><button onClick={createGoal}>Create Goal</button></p>
        </div>

        
    </div>
  );
}

export default CreateGoalPage;