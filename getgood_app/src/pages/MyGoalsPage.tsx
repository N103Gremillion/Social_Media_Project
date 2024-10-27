import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import Goal, { GoalProps, RawGoalProps } from "../components/Goal"   
//import './styles/myGoalsPage.css';

const MyGoalsPage: React.FC = () => {
  const PORT = '4000'
  const [userId] = useState<number>(1);   // hardcoded userId for testing
  const [goals, setGoals] = useState<GoalProps[]>([]);    
  const [isHovered, setIsHovered] = useState(false); 

  useEffect(() => {
    fetch(`http://localhost:${PORT}/getUserGoals?userId=${userId}`, {
      headers: {
        'Accept' : 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data: RawGoalProps[]) => {
        console.log('Parsed data:', data);
        const formattedGoals: GoalProps[] = data.map((goal) => {
          const startDate = new Date(goal.start_date);
          const endDate = new Date(goal.end_date);

          return {
            id: goal.id,
            name: goal.name,
            description: goal.description,
            startDate: startDate,
            endDate: endDate,
            userId: goal.userId,
          }
        });
        console.log('Formatted Goals:', formattedGoals)
        setGoals(formattedGoals)
      })
      .catch((error) => {
        console.error('Fetch error:', error)
      });
  }, [userId]);

  const handleRemoveGoal = (goalId: number) => {
    setGoals(goals.filter((goal) => goal.id !== goalId)); 
  }
  
  const myGoalsPageStyles: React.CSSProperties = {
      padding: '20px',
      width: '100%', // Occupies the full width without extra calculations
      boxSizing: 'border-box',
  };
  
  const pageHeaderStyles: React.CSSProperties = {
      textAlign: 'center',
      marginTop: '10px',
      fontSize: '2em',
      fontWeight: 'bold',
      color: '#333',
  };
  
  const noGoalsMessageStyles: React.CSSProperties = {
      fontSize: '1.2em',
      color: '#6c757d',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      maxWidth: '600px',
      margin: '20px auto', // Centered horizontally
      textAlign: 'center',
  };
  
  const noGoalsLinkStyles: React.CSSProperties = {
      color: '#007bff',
      textDecoration: 'none',
      fontWeight: 'bold',
  };

  const goalCardsStyles: React.CSSProperties = {
    marginLeft: '5%'
  }

  return (
    <div style={myGoalsPageStyles}>
      <h2 style={pageHeaderStyles}>My Goals</h2>
      {goals.length > 0 ? (
        <div className="goal-cards" style={goalCardsStyles}>
          {goals.map(goal => (
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
          ))}
        </div>
      ) : (
        <div style={noGoalsMessageStyles}>
          <p>Oops! It seems you dont have any goals created yet. Visit the Create Goal page to get started!</p>
          <Link 
            to="/dashboard/create-goal" 
            style={{
              ...noGoalsLinkStyles,
              textDecoration: isHovered ? 'underline' : 'none',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Create a Goal
          </Link>
        </div>
      )}
    </div>
  );    
}

export default MyGoalsPage;