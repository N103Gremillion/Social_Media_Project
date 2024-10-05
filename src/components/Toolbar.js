import React,{ useState } from "react"
import { Link } from "react-router-dom"

const Toolbar = () => {

  const width = window.innerWidth;
  const height = window.innerHeight;

  console.log('Window width: ${width}, Window height: ${height}px');
  
  const divStyle = {
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
  };

  const toolbarButtonStyle = {
    backgroundColor: 'lightblue',
    color: 'blue',
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
  };

  return (
    <div style={divStyle}>
      <Link style={toolbarButtonStyle}>Button 1</Link>
      <Link style={toolbarButtonStyle}>Button 2</Link>
      <Link style={toolbarButtonStyle}>Button 3</Link>
      <Link style={toolbarButtonStyle}>Button 4</Link>
      <Link style={toolbarButtonStyle}>Button 5</Link>
    </div>
  );
}

export default Toolbar