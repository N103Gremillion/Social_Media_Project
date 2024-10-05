import React,{ useState } from "react"


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

  const buttonStyle = {
    backgroundColor: 'lightblue',
    color: 'blue',
    // flex set to 1 so each button takes upt equal width
    width: '200%',
    height: '10%',
    border: '2px solid blue',
    padding: '10px 10px',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '16px',
    // changes the currsor to pointer when hovering
    cursor: 'pointer',
  };

  return (
    <div style={divStyle}>
      <button style={buttonStyle}>Test</button>
      <button style={buttonStyle}>Test</button>
      <button style={buttonStyle}>Test</button>
      <button style={buttonStyle}>Test</button>
      <button style={buttonStyle}>Test</button>
    </div>
  );
}

export default Toolbar