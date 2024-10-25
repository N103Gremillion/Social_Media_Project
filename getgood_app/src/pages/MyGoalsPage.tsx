import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import Goal, { GoalProps } from "../components/Goal"   
import './styles/myGoalsPage.css';

const MyGoalsPage: React.FC = () => {
    const [userId] = useState<number>(2);   // hardcoded userId for testing
    const [goals, setGoals] = useState<GoalProps[]>([]);    

    useEffect(() => {
      fetch(`http://localhost:3231/getUserGoals?userId=${userId}`, {
        headers: {
          'Accept' : 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Parsed data:', data);
          setGoals(data);
        })
        .catch((error) => {
          console.error('Fetch error:', error)
        });
    }, [userId]);

    const handleRemoveGoal = (goalId: number) => {
      setGoals(goals.filter((goal) => goal.id !== goalId)); 
    }

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
          endDate={goal.endDate} 
          userId = {userId} 
          onRemoveGoal={handleRemoveGoal}
          />
        ))
      ) : (
        <div className="no-goals-message">
          <p>Oops! It seems you dont have any goals created yet. Visit the Create Goal page to get started!</p>
          <Link to="/Dashboard/create-goal">Create a Goal</Link>
        </div>
      )}
    </div>
    );
  };
  
  export default MyGoalsPage;