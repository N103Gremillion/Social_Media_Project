import React, { useState,useEffect } from 'react';
import ReactFlow, { Edge, Node, Position } from 'reactflow';
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkpoint, updateCheckpointIDs, updateCheckpointPositions, updateEdges, addCheckpointNode } from '../components/goalFunctions';
import { addCheckpointsToDataBase } from '../components/databaseFunctions';
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
  const [userId, setUserId] = useState<string>(sessionStorage.getItem('userID') || '');
  const [pastGoalId, setPastGoalId] = useState<string>(sessionStorage.getItem('pastGoalID') || '');
  const [isEditing, setIsEditing] = useState<string>(sessionStorage.getItem("editing") || '');
  const [deleted, setDeleted] = useState<boolean>(false);
  const [shouldNavigate, setShouldNavigate] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [submitText, setSubmitText] = useState<string>('');
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

  useEffect (() => {
    console.log(`Editing: ${isEditing}`);
    setTitle((isEditing=="true") ? "Edit Your Goal" : "Create A Goal");
    setSubmitText((isEditing=="true") ? "Save Changes" : "Create Goal");
    if (isEditing == "true") {
      const fetchCheckpoints = async () => {
        
        const newCheckpoints = await getCheckpoints();
        if (newCheckpoints) {
          addCheckpoints(nodes, newCheckpoints);
          setEdges(updateEdges(nodes));
          
        }
      }
      fetchCheckpoints(); 
    } else {
      clearGoalFields();
      setNodes(beginningNodes);
    }
  }, [])

  useEffect(() => {
    if (!shouldNavigate) {
      return;
    }
    setShouldNavigate(false);
    setDeleted(false);
    console.log('erorr deletion')
    navigate('/dashboard/my-goals');

  }, [deleted]);

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
    { id: '1', position: { x: 50, y: 0 }, data: { label: 'Start', date: "01-01-01", completed: true }, sourcePosition: Position.Bottom },
      { id: '2', position: { x: 50, y: 200 }, data: { label: 'End', date: '01-01-99999', completed: false }, targetPosition: Position.Top }
  ];
  const beginningEdges: Edge[] = [{ id: '1-2', source: '1', target: '2', type: 'straight' }];
  let [nodes, setNodes] = useState<Checkpoint[]>(beginningNodes);

  const [edges, setEdges] = useState<Edge[]>(beginningEdges);

  const sortnodes = (nodes: Node[]) => {
    return ([...nodes].sort((a,b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()));
  }

  const handeCheckpointClick = (event: React.MouseEvent, node: Node) => {
    if (node.id === '1' || node.id == `${nodes.length}`) {
      event.stopPropagation();
      return;
    }
    setcurrentCheckpoint(node);
    setNewCheckpointName(node.data.label);
    setNewCheckpointDate(node.data.date.slice(0,10));
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

  const getCheckpoints = async () => {

    try {
      const goalInfo = {
          userId: userId,
          goalId: pastGoalId
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

  const addCheckpoints = (nodes: Checkpoint[], newNodes: any) => {
    for (let i=0; i < newNodes.length; i++) {
      addCheckpointNode(nodes, newNodes[i].date, newNodes[i].name, (newNodes[i].completed == "1"), setNodes, setEdges);
    }
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
    if (!checkDates() || !goal.startDate || !goal.endDate) {
      return;
    }
    const goalInfo = {
      userId,
      goalName: goal.name,
      goalDescription: goal.description,
      goalStartDate: goal.startDate.toISOString().slice(0,10),
      goalEndDate: goal.endDate.toISOString().slice(0,10),
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
        addCheckpointsToDataBase(result.id, PORT, nodes);
      }else {
        const result = await response.json();
        console.error(result);
      }
    } catch (error) {
      console.error(error);
    }

    clearGoalFields();
    setNodes(beginningNodes);
    
  }

  const deleteGoal = () => {
      console.log("Deleting goalId:", pastGoalId); 
    console.log("For userId:", userId); 
    console.log(`Editing: ${sessionStorage.getItem('editing')}`)
    fetch(`http://localhost:${PORT}/deleteGoal`, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body:  JSON.stringify({
        userId: userId,
        goalId: pastGoalId,
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw err; });
      }
      sessionStorage.setItem("editing", "false");
      setShouldNavigate(true);
      setDeleted(true);
    })
    .catch(error => {
      console.log(error);
      if (error.code === 'ER_LOCK_DEADLOCK') {
        setTimeout(() => deleteGoal(), 200);
      }
    })
    
  };

  const handleSubmit = async () => {
    await createGoal();
    if (isEditing == "true") {
      deleteGoal();
    } else {
      navigate('/dashboard/my-goals');
    }
    
  }

  const CreatGoalPageStyle: React.CSSProperties = {
    backgroundColor: 'white',
    width: '100%',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    alignItems:'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    position: 'fixed',
    zIndex: '0', 
    overflowY: 'auto'   
  };

  return (
    <div className="CreateGoal" style={CreatGoalPageStyle}>
      <h1>{title}</h1>
        <div className='goal-name'>
          <h3>Name:</h3>
          <input
              type="text"
              id="goal-name"
              name="name"
              value={goal.name}
              onChange={handleChange}
              placeholder="Enter your goal name"
            />
        </div>

        <div className="goal-descriotion">
          <h3>Description:</h3>
          <textarea
            id="goal-description"
            name="description"
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
            addCheckpoint={() => addCheckpointNode(nodes, newCheckpointDate, newCheckpointName, false, setNodes, setEdges)}
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
          <p><button onClick={handleSubmit}>{submitText}</button></p>
        </div>

        
    </div>
  );
}

export default CreateGoalPage;