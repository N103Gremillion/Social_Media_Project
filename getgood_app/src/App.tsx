import React from "react";
import MyGoalsPage from "./pages/MyGoalsPage";
import Toolbar from "./components/Toolbar";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AccountManagement from "./pages/AccountManagement";
import CreateGoalPage from "./pages/CreateGoalPage";
import EditGoalProgress from "./pages/EditGoalProgress";
import Explore from "./pages/Explore";
import Forgot from "./pages/ForgotPassword"
import Reset from "./pages/ResetPassword"
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import "./components/styles/app.css"

const Dashboard  = () => {
  return (
    <div className="content">   
      <Toolbar />
      <div className="dashboard">
        <Outlet />
        </div>
    </div>
  );
};

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <ErrorPage /> },
  { path: "signup", element: <SignUp /> },
  {path: "forgot", element: <Forgot />},
  {path: "reset-password", element: <Reset />},
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      { path: "my-goals", element: <MyGoalsPage /> },
      { path: "create-goal", element: <CreateGoalPage /> },
      { path: "account-management", element: <AccountManagement /> },
      { path: "edit-goal-progress", element: <EditGoalProgress />},
      { path: "explore", element: <Explore />}
    ],
  },
  
]);

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;