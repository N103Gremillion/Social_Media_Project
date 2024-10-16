import { fontWeight, lineHeight } from "@mui/system";
import React, { useState } from "react";
import likeImage from "../sprites/like.png";

const Post : React.FC<{title : string; content : string; author : string, date : string, imagePath: string}>  = ({title, content, author, date, imagePath}) => {
  
  const [hoveringLike, setHoveringLike] = useState<boolean>(false);
  const [likeCounter, setLikeCounter] = useState(0);

  const handleMouseEnterLike = () => {
    setHoveringLike(true);
  }

  const handleMouseLeaveLike = () => {
    setHoveringLike(false);
  }

  const handleLikeButtonClick = () => {
    setLikeCounter(likeCounter + 1);
  }

  const postStyle = {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px auto',
    width: '80%',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
  }

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  };

  const contentStyle = {
    fontSize: '1rem',
    margin: '8px',
    overflow: 'hidden',
    whiteSpace: 'normal',
    lineHeight: '1.6',
    wordWrap: "break-word"
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'blue',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  };

  const postImageStyle = {
    maxWidth: '70%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    padding: '1% 2%',
    backgroundColor: hoveringLike === true ? '#007BFF' : 'darkBlue',
    color: hoveringLike === true ? 'black' : 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
    cursor: 'pointer',
    width: '10%', 
    borderRadius: '12px',
    margin: '0 auto', 
  };
  
  const likeImageStyle = {
    width: '100%', 
    height: 'auto', 
    marginRight: '5%', 
  };

  return (
    <div style={postStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <div/>
      <div 
      style={contentStyle}
      // replace all \n with appropriate <br /> (new line)
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} 
      />
      <img
        style={postImageStyle}
        src={imagePath}
        alt="post image"
      />
      <div style={footerStyle}>
        <span>By: {author}</span>
        <span>Date: {date}</span>
      </div>
      <div>
        {/* like and comment buttons */}
        <button 
          style={buttonStyle}
          onMouseEnter={() => handleMouseEnterLike()}
          onMouseLeave={() => handleMouseLeaveLike()}
          onClick={() => handleLikeButtonClick()}
          >
          <img src={likeImage} alt="LikeButton" 
            style={likeImageStyle}
          />
        </button>
        {likeCounter}
      </div>
    </div>
  );
}

export default Post