import React, { ChangeEvent, ChangeEventHandler, useState } from "react";

const MainFeedPage : React.FC = () => {

  const [isPostPromptOpen, setIsPostPromptOpen] = useState(false);
  const [postName, setName] = useState<string>('');
  const [postDate, setDate] = useState<string>('');
  const [postTitle, setTitle] = useState<string>('');
  const [postMainText, setMainText] = useState<string>('');

  const openPromptForPost = () => {
    setIsPostPromptOpen(true);
  };

  const closePromptForPost = () => {

    setName('');
    setDate('');
    setTitle('');
    setMainText('');
    setIsPostPromptOpen(false);
    
  };

  const handlePostNameChange = (event : ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePostDateChange = (event : ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  }

  const handlePostTitleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const handlePostMainTextChange = (event : ChangeEvent<HTMLTextAreaElement>) => {
    setMainText(event.target.value);
  }

  const submitPost = () => {
    
    console.log("Your title is " + postTitle);
    console.log("Your name is " + postName);
    console.log("The date is " + postDate);
    console.log("Main Text \n" + postMainText);
    closePromptForPost();
  }

  const mainDivStyle : React.CSSProperties = {
    backgroundColor: 'lightyellow',
    width: '100%',
    height: '100vh',
    padding: '20px',
    textAlign: 'center',
    // make the items in div vertially align
    display: 'flex',
    alignItems:'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    position: 'fixed',
    marginLeft: '5%',
    zIndex: '-1'
  };

  const addPostButtonStyle : React.CSSProperties = {
    backgroundColor: 'orange',
    borderRadius: '25%',
    width: '5%',
    height: '5%',
    position: 'absolute',
    left: '85%',
    bottom: '5%'
  }

  const postPromptOverlayStyle : React.CSSProperties = {
    // align elements in div vertically with even spacing
    backgroundColor: 'lightblue',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space',
    height: '100vh',
    margin: '3%',
    padding: '3%',
    border: '2px solid blue' 
  }

  const titleInputStyle : React.CSSProperties = {
    width: '20vw'
  }

  const nameInputStyle : React.CSSProperties = {
    width: '20vw',
  }

  const dateInputStyle : React.CSSProperties = {
    width: '20vw'
  }

  const paragraphInputStyle : React.CSSProperties = {
    width: '80vw',
    height: '40%',  
  }

  const submitPostButtonStyle : React.CSSProperties ={
    width: '20vw'
  }

  const closePostButtonStyle : React.CSSProperties = {
    width: '20vw'
  }

  if (isPostPromptOpen) {
    return (
      <div className="postPromptOverlay" style={postPromptOverlayStyle}>

        <h2 style={{textAlign: 'center'}}> Add your post! </h2>

        <p> What is the title? </p>
        <input
        style={titleInputStyle}
        placeholder="Title"
        maxLength={50}
        type="text"
        value={postTitle}
        onChange={handlePostTitleChange}
        ></input>

        <p> What is your name? </p>
        <input
        style={nameInputStyle}
        placeholder="Name"
        maxLength={30}
        type="text"
        value={postName}
        onChange={handlePostNameChange}
        ></input>

        <p> What is the date? (mm/dd/yyyy) </p>
        <input
        style={dateInputStyle}
        placeholder="MM/DD/YYYY"
        maxLength={10}
        type="text"
        value={postDate}
        onChange={handlePostDateChange}
        ></input>

        <p> Add you contents here. </p>
        <textarea 
        style={paragraphInputStyle}
        placeholder="Enter what you want to say."
        value={postMainText}
        onChange={handlePostMainTextChange}
        ></textarea>

        <div className="postPromptButtonContainer">
          <button 
            style={submitPostButtonStyle}
            onClick={submitPost} 
            className="submitPostButton">
            Submit Post
          </button>
          <button 
            style={closePostButtonStyle}
            onClick={closePromptForPost} 
            className="closePostButton">
            Close
          </button>
        </div>

      </div>
    );
  }

  return (
    <div style={mainDivStyle}>

      <button 
      style={addPostButtonStyle} 
      className="addPostButton"
      onClick={openPromptForPost}>
        + Post
      </button>

    </div>
  );
}

export default MainFeedPage;