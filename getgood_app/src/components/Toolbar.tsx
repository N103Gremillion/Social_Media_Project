import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import './styles/toolbar.css';
import CreatePostModal from "./CreatePostModal";

const Toolbar : React.FC = () => {

  const navigate = useNavigate();

  const hangleCreateGoalNavigation = () => {
    sessionStorage.setItem("editing", "false");
    navigate('/dashboard/create-goal');
  }

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  }

  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);


  return (
    <div className="toolbar">
      <img className="logo" src={require("../assets/get_goals_logo.png")}/>
      <div className="nav-items">
      <Link
        className="nav-item"
        to="my-goals"
      >
        My Goals
      </Link>
      <button
        className="nav-item"
        onClick={hangleCreateGoalNavigation}
      >
        Create Goal
      </button>
      <Link
        className="nav-item"
        to="account-management"
      >
        Account Manager
      </Link>
      <Link
        className="nav-item"
        to="explore"
      >
        Explore
      </Link>
      <button
        className="nav-item"
        onClick={() => setShowCreatePost(true)}
      >
        Create Post
      </button>
      <button
        className="nav-item"
        onClick={handleLogout}
      >
        Logout
      </button>
      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)}/>}
      </div>
    </div>
  );
  
}

export default Toolbar