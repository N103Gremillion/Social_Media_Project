import React from "react";
import "../components/styles/home.css"
import { useState, useEffect } from "react";

interface users {
  userId: number,
  name: string,
  profilePicURL: string
}



const Home = () => {

  const [followersInfo, setFollowersInfo] = useState<users[]>([]);
  const [followerIds, setFollowerIds] = useState<number[]>([]);
  const BASE_URL: string = 'http://localhost:4000/';
  const id = sessionStorage.getItem('userID');


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

