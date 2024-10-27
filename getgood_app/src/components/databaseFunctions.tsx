import { Checkpoint } from './goalFunctions';

export const addCheckpointsToDataBase = async (goalId: string, PORT: number, nodes: Checkpoint[]) => {
    for (let i=1; i<nodes.length-1; i++) {
      addCheckpointToDataBase(nodes[i], PORT, goalId);
    }
  };
  
export const addCheckpointToDataBase = async (checkpoint: Checkpoint, PORT: number, goalId: string) => {
    const name = checkpoint.data.label;
    const date = checkpoint.data.date.slice(0,10);
    const completed = checkpoint.data.completed;
  
    try {
      const response = await fetch(`http://localhost:${PORT}/addCheckpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, date, goalId, completed}),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      }else {
        console.error(response);
      }
  
    } catch (error) {
      console.error(error);
    }
  }; 

export const deleteCheckpointsFromDataBase = async (PORT: number, goalId: string) => {

    try {
        const response = await fetch(`http://localhost:${PORT}/deleteCheckpoints`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({goalId}),
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
}; 