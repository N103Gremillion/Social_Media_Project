import React from "react";
import "../components/styles/home.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { response } from "express";
import { Image } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";

interface users {
  userId: number,
  name: string,
  profilePicture: string
}



const Home = () => {

  const [followersInfo, setFollowersInfo] = useState<users[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const BASE_URL: string = 'http://localhost:4000/';
  const id = Number(sessionStorage.getItem('userID'));

  const fetchFollowersIds = async () => {
    await axios.get(`${BASE_URL}followerIds`, {
      params:
      {
          userId: id
      }
     }) 
      .then(response => {
        setFollowingIds(response.data);
      })
      .catch(error => console.error('Error fetching followers:', error));
  }

  const fetchFollowingInfo = async () => {
    console.log(followingIds)
    await axios.get(`${BASE_URL}followingInfo`, {
      params:
      {
          followingIds: followingIds
      }
     }) 
      .then(response => {
        console.log(response.data)
        const formattedFollowers = response.data.followingInfo.map(
          (follower: users, index: number) => ({
            name: follower.name,
            profilePicture: follower.profilePicture
          }));
          setFollowersInfo(formattedFollowers);
      })
      .catch(error => console.error('Error fetching followers info:', error));
  }

  const fetchFollowersPosts = async () => {

  }

  useEffect(() => {fetchFollowersIds()}, [])

  useEffect(() => {
    if (followingIds.length > 0) {
      fetchFollowingInfo();
      fetchFollowersPosts();
    }
  }, [followingIds]);

  return (
    <div className="home-page">
      <div className="followers-scroller">
        {followersInfo.map((user, index) => (
          <span key={index}>
            {user.profilePicture && user.profilePicture !== './defaultProfile.jpg' ? (
              <div className="picture-container">
              <Image
                src={user.profilePicture}
                roundedCircle
                className="me-2"
                style={{width: 80, height: 80}}
              />
              </div>
            ): (
              <div className="icon-container">
                <PersonIcon style={{fontSize: 80, color: 'gray'}}/>
              </div>
            )}
            <p style={{color: "white", textAlign: "center"}}>{user.name}</p>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Home;

