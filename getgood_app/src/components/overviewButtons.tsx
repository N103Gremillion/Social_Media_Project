import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaUserPlus, FaCheck, FaEnvelope } from 'react-icons/fa';
import "./styles/overview.css"

const FollowButton = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Button
      variant={isFollowing ? "success" : "primary"}
      className="follow-button"
      onClick={handleClick}
    >
      {isFollowing ? <FaCheck /> : <FaUserPlus />}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

const MessageButton = () => {
  const handleClick = () => {
    alert("Message button clicked!");
  };

  return (
    <Button
      variant="info"
      className="message-button"
      onClick={handleClick}
    >
      <FaEnvelope />
      Message
    </Button>
  );
}

export {FollowButton, MessageButton};
