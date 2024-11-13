import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { FaUserPlus, FaCheck, FaEnvelope } from 'react-icons/fa';
import "./styles/overview.css";
import axios from 'axios';

interface FollowButtonProps {
  userIdToFollow: number;
  currentUserId: number;
}

const FollowButton = ({ userIdToFollow, currentUserId }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = 'http://localhost:4000/';

  const checkIfFollowing = async () => {
    console.log("trying to check if following")
    console.log(userIdToFollow)
    try {
      const response = await axios.get(`${BASE_URL}isFollowing`, {
        params: { currentUserId, userIdToFollow },
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  useEffect(() => {
    checkIfFollowing();
  }, [currentUserId, userIdToFollow]); // Remove isFollowing from dependencies

  const followUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}follow`, {
        followerId: currentUserId,
        userId: userIdToFollow,
      });
      if (response.data.success) {
        setIsFollowing(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const unfollowUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}unfollow`, {
        followerId: currentUserId,
        userId: userIdToFollow,
      });
      if (response.data.success) {
        setIsFollowing(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (userIdToFollow === currentUserId || isLoading) return;
    isFollowing ? unfollowUser() : followUser();
  };

  return (
    <Button
      variant={isFollowing ? "success" : "primary"}
      className="follow-button"
      onClick={handleClick}
      disabled={isLoading}
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

export { FollowButton, MessageButton };
