import React from "react";
import "../components/styles/home.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { response } from "express";

interface users {
  userId: number,
  name: string,
  profilePicURL: string
}



const Home = () => {

  const [followersInfo, setFollowersInfo] = useState<users[]>([]);
  const [followerIds, setFollowerIds] = useState<number[]>([]);
  const BASE_URL: string = 'http://localhost:4000/';
  const id = Number(sessionStorage.getItem('userID'));

  const fetchFollowersIds = async () => {
    console.log("fetching Ids")
    await axios.get(`${BASE_URL}followerIds`, {
      params:
      {
          userId: id
      }
     }) 
      .then(response => {
        console.log(response.data)
        setFollowerIds(response.data);
      })
      .catch(error => console.error('Error fetching followers:', error));
  }

  useEffect(() => {fetchFollowersIds()}, [])

  useEffect(() => {
    console.log(followerIds);
  }, [followerIds]);

  return (
    <div className="home-page">
      <div className="followers-scroller">
        {/* all the users you follow */}
        {followersInfo.map((user) => (
          <span> key={user.userId}
            <p>user.name</p>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Home;

