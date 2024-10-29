import React, { useState } from "react";
import likeImage from "../sprites/like.png";
import deleteImage from "../sprites/delete.png";

const Post : React.FC<{
  title : string; 
  content : string; 
  author : string, 
  date : string, 
  imagePath: string, 
  likes: number
}>  = ({title, content, author, date, imagePath, likes}) => {
  
  const [hoveringLike, setHoverLike] = useState<boolean>(false);
  const [hoveringDelete, setHoverDelete] = useState<boolean>(false);
  const [likeCounter, setLikeCounter] = useState(likes);

  const handleMouseEnterLike = () => {
    setHoverLike(true);
  }

  const handleMouseLeaveLike = () => {
    setHoverLike(false);
  }

  const handleMouseEnterDelete = () => {
    setHoverDelete(true);
  }

  const handleMouseLeaveDelete = () => {
    setHoverDelete(false);
  }

  const handleLikeButtonClick = () => {
    setLikeCounter(likeCounter + 1);
  }

  const handleDeleteButtonClick = () => {
    console.log("Delete");
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
    overflow: 'hidden',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  };

  const contentStyle : React.CSSProperties = {
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

  const buttonStyle: React.CSSProperties = {
    padding: '1% 2%',
    backgroundColor: 'none',
    alignItems: 'right',
    cursor: 'pointer',
    width: '7%',
    height: '6%',
    borderRadius: '12px',
    margin: '0 auto',
    display: 'block',
    border: 'none',      
    outline: 'none',
  }

  const deleteImageStyle = {
    ...buttonStyle,
    marginRight: '95%',
    opacity: hoveringDelete ? 0.7 : 1
  };

  const likeImageStyle = {
    ...buttonStyle,
    marginRight: '45%', 
    width: '10%', 
    height: '9%', 
    opacity: hoveringLike ? 0.7 : 1
  };

  return (
    <div style={postStyle}>
      <img 
        src={deleteImage} alt="Delete"
        style={deleteImageStyle}
        onMouseEnter={handleMouseEnterDelete}
        onMouseLeave={handleMouseLeaveDelete}
        onClick={handleDeleteButtonClick}
      />
      <h2 style={titleStyle}>{title}</h2>
      <div 
      style={contentStyle}
      // replace all \n with appropriate <br /> (new line)
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} 
      />
      <img
        style={postImageStyle}
        src={imagePath}
      />
      <div style={footerStyle}>
        <span>By: {author}</span>
        <span>Date: {date}</span>
      </div>
      <div>
        {/* like and comment buttons */}
        <img src={likeImage} alt="LikeButton" 
          style={likeImageStyle}
          onClick={handleLikeButtonClick}
          onMouseEnter={handleMouseEnterLike}
          onMouseLeave={handleMouseLeaveLike}
        />
        {likeCounter}
      </div>
    </div>
  );
}

export default Post