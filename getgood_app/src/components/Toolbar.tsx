import React,{ useState } from "react"
import { Link } from "react-router-dom"

const Toolbar : React.FC = () => {

  // state to keep track of hover event
  const [hovered, setHovered] = useState<string | null>(null);

  const handleMouseEnter = (buttonId : string) =>{
    setHovered(buttonId)
  }

  const handleMouseLeave = () => {
    setHovered(null)
  }

  const divStyle : React.CSSProperties = {
    backgroundColor: 'skyblue',
    width: '5%',
    height: '100vh',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    // make the items in div vertially align
    display: 'flex',
    alignItems:'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    border: '2px solid royalblue',
    position: 'fixed',
    top: '0',
    left: '0',
    // make sure it renders on top of pages
    zIndex: '10',
  };

  const toolbarButtonStyle  = (buttonId : string) : React.CSSProperties => ({
    backgroundColor: hovered === buttonId ? 'lightgrey' : 'lightblue',
    color: hovered === buttonId ? 'white' : 'blue',
    width: '125%', 
    height: '10%',
    border: '2px solid blue',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '16px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    // Use flexbox to center text
    display: 'flex', 
    // Center text vertically
    alignItems: 'center', 
    justifyContent: 'center',
    // this adds a smother transition on hover events
    transition: 'background-color 0.3s, color 0.3s'
  });

  return (
    <div style={divStyle}>
      <Link
        style ={toolbarButtonStyle('Button1')}
        to="MyGoalsPage"
        onMouseEnter={() => handleMouseEnter('Button1')}
        onMouseLeave={handleMouseLeave}
      >
        Button 1
      </Link>
      <Link
        style={toolbarButtonStyle('Button2')}
        to="CreateGoalPage"
        onMouseEnter={() => handleMouseEnter('CreateGoalPage')}
        onMouseLeave={handleMouseLeave}
      >
        Button 2
      </Link>
      <Link
        style={toolbarButtonStyle('Button3')} 
        to="AccountManagment"
        onMouseEnter={() => handleMouseEnter('Button3')}
        onMouseLeave={handleMouseLeave}
      >
        Button 3
      </Link>
      <Link
        style={toolbarButtonStyle('Button4')}
        to="Page4"
        onMouseEnter={() => handleMouseEnter('Button4')}
        onMouseLeave={handleMouseLeave}
      >
        Button 4
      </Link>
      <Link
        style={toolbarButtonStyle('Button5')} 
        to="Page5"
        onMouseEnter={() => handleMouseEnter('Button5')}
        onMouseLeave={handleMouseLeave}
      >
        Button 5
      </Link>
    </div>
  );
}

export default Toolbar