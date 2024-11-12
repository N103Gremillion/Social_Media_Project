import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import './styles/toolbar.css';
import { SearchButton, HomeButton } from "./toolarbButtons";
import CreatePostModal from "./CreatePostModal";

const Toolbar : React.FC = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  }

  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);


  return (
    <div className="toolbar">
      <img className="logo" src={require("../assets/get_goals_logo.png")}/>
      
      <div className="nav-items">
      <SearchButton/>
      <HomeButton/>
      <Link
        className="nav-item"
        to="goals"
      >
        Goals
      </Link>
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