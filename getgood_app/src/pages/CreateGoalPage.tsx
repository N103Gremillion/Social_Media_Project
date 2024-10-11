import React, { useState } from 'react';

interface Checkpoint {
  checkpointName: string;
  checkpointDate: string;
}

const CreateGoalPage = () => {
  const port = 3231;
  const [goalName, setGoalName] = useState<string>('');
  const [goalDescription, setGoalDescription] = useState<string>('');
  const [goalStartDate, setGoalStartDate] = useState<string>('');
  const [goalEndDate, setGoalEndDate] = useState<string>('');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [newCheckpointName, setNewCheckpointName] = useState<string>('');
  const [newCheckpointDate, setNewCheckpointDate] = useState<string>('');

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
            type="text"
            value={goalStartDate}
            onChange={(e) => setGoalStartDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
          <p>to</p>
          <input
            type="text"
            value={goalEndDate}
            onChange={(e) => setGoalEndDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div className="checkpoint-display">
          <h2>Checkpoints:</h2>
          <p>
            Start {combineCheckpoints()} - End
          </p>
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
