import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import AccountOverview from "./AccountOverview";
import "../components/styles/home.css";

interface users {
  name: string;
  profilePictureUrl: string;
  id: number;
}

interface UserFollowers {
  followers: number;
  following: number;
}

const Home = () => {
  const [followersInfo, setFollowersInfo] = useState<users[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<users | null>(null);
  const [selectedUserFollower, setSelectedUserFollower] = useState<UserFollowers | null>(null);
  const BASE_URL: string = "http://localhost:4000/";
  const id = Number(sessionStorage.getItem("userID"));

  const fetchFollowersIds = async () => {
    try {
      const response = await axios.get(`${BASE_URL}followerIds`, { params: { userId: id } });
      const ids = response.data.map((item: { user_id: number }) => item.user_id);
      setFollowingIds(ids);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowingInfo = async () => {
    if (followingIds.length > 0) {
      try {
        const response = await axios.get(`${BASE_URL}followingInfo`, { params: { followingIds } });
        const formattedFollowers = response.data.followingInfo.map(
          (follower: { id: number; name: string; profilePicture: string }, index: number) => ({
            id: followingIds[index], 
            name: follower.name,
            profilePictureUrl: follower.profilePicture,
          })
        );
        setFollowersInfo(formattedFollowers);
        console.log("Formatted Followers:", formattedFollowers); // Log the structure
      } catch (error) {
        console.error("Error fetching followers info:", error);
      }
    }
  };
  

  const fetchUserFollowers = async (userId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}followers`, { params: { userId } });
      setSelectedUserFollower({
        followers: response.data.followersCount,
        following: response.data.followingCount,
      });
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  useEffect(() => {
    fetchFollowersIds();
  }, []);

  useEffect(() => {
    if (followingIds.length > 0) {
      fetchFollowingInfo();
    }
  }, [followingIds]);

  const handleFollowerClick = (user: users) => {
    setSelectedUser(user);
    fetchUserFollowers(user.id);
  };

  return (
    <>
      <div className="home-page">
        <div className="followers-scroller">
          {followersInfo.map((user, index) => (
            <span key={index} onClick={() => handleFollowerClick(user)}>
              {user.profilePictureUrl && user.profilePictureUrl !== "./defaultProfile.jpg" ? (
                <div className="picture-container">
                  <Image
                    src={user.profilePictureUrl}
                    roundedCircle
                    className="me-2"
                    style={{ width: 80, height: 80 }}
                  />
                </div>
              ) : (
                <div className="icon-container">
                  <PersonIcon style={{ fontSize: 80, color: "gray" }} />
                </div>
              )}
              <p style={{ color: "white", textAlign: "center" }}>{user.name}</p>
              <p style={{ color: "white", textAlign: "center" }}>{user.id}</p>
            </span>
          ))}
        </div>
      </div>
      {selectedUser && (
        <AccountOverview
          userInfo={selectedUser}
          userFollowerCount={selectedUserFollower?.followers || 0}
          userFollowingCount={selectedUserFollower?.following || 0}
          show={!!selectedUser}
          handleClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default Home;
