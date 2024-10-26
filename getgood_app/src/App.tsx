import React from "react";
import MyGoalsPage from "./pages/MyGoalsPage";
import Toolbar from "./components/Toolbar";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AccountManagement from "./pages/AccountManagement";
import CreateGoalPage from "./pages/CreateGoalPage";
import MainFeedPage from "./pages/MainFeedPage";
import EditGoalProgress from "./pages/EditGoalProgress";
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";


const dashboardStyle : React.CSSProperties = {
  marginLeft: '5%',
  height: '100vh',
  boxSizing: 'border-box',
  overflow: 'auto',
};

const Dashboard  = () => {
  return (
    <div>   
      <Toolbar />
      <div style={dashboardStyle}>
        <Outlet />
        </div>
    </div>
  );
};

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <ErrorPage /> },
  { path: "signup", element: <SignUp /> },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      { path: "my-goals", element: <MyGoalsPage /> },
      { path: "create-goal", element: <CreateGoalPage /> },
      { path: "account-management", element: <AccountManagement /> },
      { path: "main-feed", element: <MainFeedPage /> },
      { path: "edit-goal-progress", element: <EditGoalProgress />}
    ],
  },
  
]);


function App() {

  const examplePost = {
    title: "Hello World",
    content: "this is the first of my posts asdlkfjasdklfjasdl;kfjsd;lfsdkfjasdklfjasdfkljasdfkl;asdjfl;kasdf",
    author: "Nathan Gremillion",
    date: "October 6th 2024"
  };

  return (
    <div>

      {/* <MainFeedPage/> */}
      {/* <MainFeedPage/> */}
      
      <RouterProvider router={router} />
    </div>
  );
};



export default App;










