import React, { useState, useEffect } from 'react'; 
import Goal, { GoalProps } from "../components/Goal"

const MyGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalProps[]>([]); 

  const fetchGoals = async () => {
    const response = await fetch('/getUserGoals');   //replace with endpoint
    const data = await response.json(); 
    return data.goals; 
  }

  useEffect(() => {
    const loadGoals = async() => {
      const fetchedGoals = await fetchGoals(); 
      setGoals(fetchedGoals); 
    }; 

    loadGoals(); 
  }, []); 

  return (
    <div className="my-goals-pg">
      <h2>My Goals</h2>
      {goals.length > 0 ? (
        goals.map(goal => (
          <Goal 
          key={goal.id}
          id={goal.id}
          name={goal.name}
          description={goal.description}
          startDate={goal.startDate}
          endDate={goal.endDate}  />
        ))
      ) : (
        <p>No Goals belonging to USER</p>
      )}
    </div>
    );
  };
  export default MyGoalsPage;