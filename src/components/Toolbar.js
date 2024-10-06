import React,{ useState } from "react"
import { Link, Outlet } from "react-router-dom"

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
    position: 'fixed',
    top: '0',
    left: '0',
    // make sure it renders on top of pages
    zIndex: '10',
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
      <Link style={toolbarButtonStyle} to="Page1">Button 1</Link>
      <Link style={toolbarButtonStyle} to="Page2">Button 2</Link>
      <Link style={toolbarButtonStyle} to="Page3">Button 3</Link>
      <Link style={toolbarButtonStyle} to="Page4">Button 4</Link>
      <Link style={toolbarButtonStyle} to="Page5">Button 5</Link>
    </div>
  );
}

export default Toolbar