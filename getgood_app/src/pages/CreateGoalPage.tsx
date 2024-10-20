import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import ReactFlow, { addEdge } from 'reactflow';
import { GoalProps } from '../components/Goal'
import { Position } from 'reactflow'
import 'reactflow/dist/style.css';
import { getOverlayDirection } from 'react-bootstrap/esm/helpers';

interface Checkpoint {
  checkpointName: string;
  checkpointDate: string;
}

const CreateGoalPage = () => {
  const location = useLocation(); 

  const [goal, setGoal] = useState({
    id: null, 
    goalName: '',
    goalDescription: '', 
    goalStartDate: '',
    goalEndDate: '', 
  });
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [newCheckpointName, setNewCheckpointName] = useState<string>('');
  const [newCheckpointDate, setNewCheckpointDate] = useState<string>('');
  const userId = 1;

  useEffect (() => {
    if (location.state) {
      const { name, description, startDate, endDate } = location.state as GoalProps; 
      setGoal((prevGoal) => ({
        ...prevGoal,
        goalName: name, 
        goalDescription: description,
        goalStartDate: startDate, 
        goalEndDate: endDate,
      }));
    }
  }, [location.state]); 

  const clearGoalFields = () => {
    setGoal({
      id: null,
      goalName: '',
      goalDescription: '', 
      goalStartDate: '',
      goalEndDate: '',
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

  const [checkpointNodes, setCheckpointNodes] = useState([
    { id: '1', position: { x: 50, y: 20 }, data: { label: 'Start' }, sourcePosition: Position.Right },
    { id: '2', position: { x: 250, y: 20 }, data: { label: 'End' }, sourcePosition: Position.Right, targetPosition: Position.Left }
  ]);

  const [edges, setEdges] = useState([
    { id: '1-2', source: '1', target: '2', type: 'straight' }
  ]);

  const addCheckpoint = () => {
    if (newCheckpointName && newCheckpointDate) {
  
      const newCheckpoint: Checkpoint = {
        checkpointName: newCheckpointName,
        checkpointDate: newCheckpointDate
      }

      // sort new checkpoint based on date
      const updatedCheckpoints = [...checkpoints, newCheckpoint].sort((a,b) => {
        const date1 = new Date(a.checkpointDate).getTime();
        const date2 = new Date(b.checkpointDate).getTime();

        if (date1<date2) {
          return -1;
        }
        return 1;
      });

      setCheckpoints(updatedCheckpoints);
      clearCheckpointFields();
    }
  };

  const createGoal = async () => {
    const goalInfo = {
      userId,
      goalName: goal.goalName,
      goalDescription: goal.goalDescription,
      goalStartDate: goal.goalStartDate,
      goalEndDate: goal.goalEndDate,
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
    setGoal({
      id: null,
      goalName: '',
      goalDescription: '',
      goalStartDate: '',
      goalEndDate: ''
    }); 
  }; 

  const combineCheckpoints = () => {
    const checkpointValues = []

    for (let i=0; i<checkpoints.length; i++) {
      checkpointValues.push( <span key={i}> - {checkpoints[i].checkpointName} </span> );
    }
    return checkpointValues;
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
              name="goalName"
              value={goal.goalName}
              onChange={handleChange}
              placeholder="Enter your goal name"
            />
        </div>

        <div className="goal-descriotion">
          <h3>Description:</h3>
          <textarea
            id="goal-description"
            name="goalDescription"
            value={goal.goalDescription}
            onChange={handleChange}
            placeholder="Enter a description of your goal"
          />
        </div>
      

        <div className="start-end-dates">
          <h3>Length:</h3> 
          <p>From</p>
          <input
            type="text"
            name="goalStartDate"
            value={goal.goalStartDate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
          />
          <p>to</p>
          <input
            type="text"
            name="goalEndDate"
            value={goal.goalEndDate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
          />
          <div style={{ width: '700px', height: '8vh', overflowX: 'scroll' }}>
            <ReactFlow nodes={checkpointNodes} edges={edges} panOnDrag={false}/>
          </div>
        </div>

        <div className="checkpoint-display">
          <h2>Checkpoints:</h2>
          <p>
            Start {combineCheckpoints()} - End
          </p>
          <div>
            
          </div>
        </div>

        <div className="checkpoint-form">
          <h3>Add Checkpoint</h3>
          <input
            type="text"
            value={newCheckpointName}
            onChange={(e) => setNewCheckpointName(e.target.value)}
            placeholder="Checkpoint Name"
          />
          <input
            type="text"
            value={newCheckpointDate}
            onChange={(e) => setNewCheckpointDate(e.target.value)}
            placeholder="YYYY MM DD"
          />
          <p><button onClick={addCheckpoint}>Add Checkpoint</button></p>

          <p><button onClick={createGoal}>Create Goal</button></p>
        </div>

        
    </div>
  );
}

export default CreateGoalPage;
