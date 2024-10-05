import React,{ useState } from "react"


const Toolbar = () => {
  const [curButton, setCurButton] = useState(null);
  const [tag, setTag] = useState('Nathan');
  
  // function to handle button clicks
  const handleButtonClick = (buttonId) => {
    setCurButton(buttonId);
    console.log('Button ${buttonId} clicked!');
  }

  // styling for the buttons
  const buttonStyle = {
    margin: '1 auto',
    color: 'black',
    padding: '0.6rem 1.2rem',
    border: 'none',
  }

  return (
    <div className="toolbar">
      <p>Toolbar</p>
        <div className="buttonContainer" style={{textAlign: 'left', marginTop: '2rem' }}>
            <button style={buttonStyle} onClick={() => handleButtonClick(1)}>Button 1</button>
            <button style={buttonStyle} onClick={() => handleButtonClick(2)}>Button 2</button>
            <button style={buttonStyle} onClick={() => handleButtonClick(3)}>Button 3</button>
            <button style={buttonStyle} onClick={() => handleButtonClick(4)}>Button 4</button>
        </div>
    </div>
  )
}

export default Toolbar