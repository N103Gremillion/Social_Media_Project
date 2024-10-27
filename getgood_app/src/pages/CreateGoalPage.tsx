import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Node, Position } from 'reactflow';
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkpoint, updateCheckpointIDs, updateCheckpointPositions, updateEdges, addCheckpointNode } from '../components/goalFunctions';
import AddCheckpointModal from '../components/AddCheckpointModal';
import EditCheckpointModal from '../components/EditCheckpointModal';
import ErrorModal from '../components/ErrorModal';
import { GoalProps } from '../components/Goal'
import 'reactflow/dist/style.css';

const CreateGoalPage: React.FC = () => {
  const location = useLocation(); 

  const [goal, setGoal] = useState<Partial<GoalProps>>({
    id: null, 
    name: '',
    description: '', 
    startDate: new Date(),
    endDate: new Date(), 
  });

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [newCheckpointName, setNewCheckpointName] = useState<string>('');
  const [newCheckpointDate, setNewCheckpointDate] = useState<string>('');
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [isEditCheckpointModalOpen, setIsEditCheckpointModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  let [currentCheckpoint, setcurrentCheckpoint] = useState<Node>();
  const userId = 1;
  const PORT = 4000;

  useEffect (() => {
    if (location.state) {
      console.log("Recieved location state:", location.state)
      const { id, name, description, startDate, endDate } = location.state as GoalProps; 
      setGoal({
        id: id || null, 
        name: name || '', 
        description: description || '', 
        startDate: startDate instanceof Date ? startDate: new Date(startDate),
        endDate: endDate instanceof Date ? endDate: new Date(endDate),
      });
    }
  }, [location.state]); 

  const clearGoalFields = () => {
    setGoal({
      id: null,
      name: '',
      description: '', 
      startDate: undefined,
      endDate: undefined,
    })
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {    // handle input types for bot input and text area html events
    const { name, value } = e.target; 
    setGoal((prevGoal) => ({
      ...prevGoal,
      [name]: value,
    }));
  };

  const clearCheckpointFields = () => {
    setNewCheckpointName('');
    setNewCheckpointDate('');
  };
  const beginningNodes: Checkpoint[] = [
    { id: '1', position: { x: 50, y: 20 }, data: { label: 'Start', date: "01-01-01" }, sourcePosition: Position.Right, targetPosition: Position.Left },
    { id: '2', position: { x: 250, y: 20 }, data: { label: 'End', date: '01-01-99999' }, sourcePosition: Position.Right, targetPosition: Position.Left }
  ];
  const beginningEdges: Edge[] = [{ id: '1-2', source: '1', target: '2', type: 'straight' }];
  let [nodes, setNodes] = useState<Checkpoint[]>(beginningNodes);

  const [edges, setEdges] = useState<Edge[]>(beginningEdges);

  const sortnodes = (nodes: Node[]) => {
    return ([...nodes].sort((a,b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()));
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

    setNodes(() => {
      const sortedNodes = sortnodes(newNodes);
      const idUpdatedNodes = updateCheckpointIDs(sortedNodes);
      const positionUpdatedNodes = updateCheckpointPositions(idUpdatedNodes);
      setEdges(updateEdges(positionUpdatedNodes));
      return positionUpdatedNodes;
    });
    clearCheckpointFields();
  }

  const deleteCheckpoint = () => {
    if (currentCheckpoint == null) {
      return;
    }

    let deleteId = currentCheckpoint.id;
    const newNodes: Node[] = nodes.filter(node => node.id != deleteId);

    setNodes(() => {
      const sortedNodes = sortnodes(newNodes);
      const idUpdatedNodes = updateCheckpointIDs(sortedNodes);
      const positionUpdatedNodes = updateCheckpointPositions(idUpdatedNodes);
      setEdges(updateEdges(positionUpdatedNodes));
      return positionUpdatedNodes;
    })
    
    clearCheckpointFields();
  }

  const checkDates = () => {
    const startDate = new Date(goal.startDate || '2024-01-01').getTime();
    const endDate = new Date(goal.endDate || '2024-01-01').getTime();
    const firstCheckpointDate = new Date(nodes[1].data.date).getTime();
    const lastCheckpointDate = new Date(nodes[nodes.length-2].data.date).getTime();
    let finalState = true;

    if (startDate > endDate) {
      setErrorMessage("Start date is after final date. Please fix before Submitting.");
      
      setIsErrorModalOpen(true);
      finalState = false;
    } else if ((firstCheckpointDate < startDate || lastCheckpointDate > endDate) && nodes.length>2) {
      setErrorMessage("Checkpoint Dates are not within goal time span. Please fix before Submitting.");
      setIsErrorModalOpen(true);
      finalState = false;
    }

    return finalState;
  }

  const createGoal = async () => {
    if (!checkDates()) {
      return;
    }
    const goalInfo = {
      userId,
      goalName: goal.name,
      goalDescription: goal.description,
      goalStartDate: goal.startDate,
      goalEndDate: goal.endDate,
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
        sessionStorage.setItem('goalId', result.id);
        console.log(sessionStorage.getItem('goalId'));
        addCheckpointsToDataBase(result.id);
      }else {
        const result = await response.json();
        console.error(result);
      }
    } catch (error) {
      console.error(error);
    }

    clearGoalFields();
    setNodes(beginningNodes);
    navigate('/dashboard/my-goals');
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
    setGoal({
      id: null,
      name: '',
      description: '',
      startDate: undefined,
      endDate: undefined
    }); 
  }; 

  const CreatGoalPageStyle: React.CSSProperties = {
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
    <div className="CreateGoal" style={CreatGoalPageStyle}>
      <h1>Create A Goal</h1>
        <div className='goal-name'>
          <h3>Name:</h3>
          <input
              type="text"
              id="goal-name"
              name="goalName"
              value={goal.name}
              onChange={handleChange}
              placeholder="Enter your goal name"
            />
        </div>

        <div className="goal-descriotion">
          <h3>Description:</h3>
          <textarea
            id="goal-description"
            name="goalDescription"
            value={goal.description}
            onChange={handleChange}
            placeholder="Enter a description of your goal"
          />
        </div>
      

        <div className="start-end-dates">
          <h3>Length:</h3> 
          <p>From</p>
          <input
            type="date"
            value={goal.startDate ? goal.startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setGoal(() => {
              const newGoal = {...goal};
              newGoal.startDate = new Date(e.target.value);
              return newGoal;
            } )}
            placeholder="YYYY-MM-DD"
          />
          <p>to</p>
          <input
            type="date"
            value={goal.endDate ? goal.endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setGoal(() => {
              const newGoal = {...goal};
              newGoal.endDate = new Date(e.target.value);
              return newGoal;
            } )}
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
            addCheckpoint={() => addCheckpointNode(nodes, newCheckpointDate, newCheckpointName, setNodes, setEdges)}
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
          <ErrorModal
            isOpen={isErrorModalOpen}
            close={() => {setIsErrorModalOpen(false)}}
            errorMessage={errorMessage}
          />
        </div>

        <div className='create-goal'>
          <p><button onClick={createGoal}>Create Goal</button></p>
        </div>

        
    </div>
  );
}

export default CreateGoalPage;