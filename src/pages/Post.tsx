import React from "react";

const Post : React.FC<{title : string; content : string; author : string, date : string}>  = ({title, content, author, date}) => {
  
  const postStyle = {
    border: '1px solid black',
    borderRadius: '5px',
    padding: '16px',
    marginTop: '16px',
    marginBottom: '16px',
    marginLeft: '5%',
    // this create a shadw effect around the element
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  }

  const titleStyle = {
    fontSize: '1.5rem',
    margin: '8px',
  };

  const contentStyle = {
    fontSize: '1rem',
    margin: '8px',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'blue',
  };

  return (
    <div style={postStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <p style={contentStyle}>{content}</p>
      <div style={footerStyle}>
        <span>By: {author}</span>
        <span>Date: {date}</span>
      </div>
      <div>
        {/* like and comment buttons */}
        <button onClick={() => console.log('Liked!')}>Like</button>
        <button onClick={() => console.log('Commented!')}>Comment</button>
      </div>
    </div>
  );
}

export default Post