import React from "react";
import Toolbar from "./components/Toolbar";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AccountManagement from "./pages/AccountManagement";
import EditGoalProgress from "./pages/EditGoalProgress";
import Explore from "./pages/Explore";
import Goals from "./pages/Goals";
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import "./components/styles/app.css"
import NotificationsPage from "./pages/NotificationsPage";

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
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      { path: "account-management", element: <AccountManagement /> },
      { path: "edit-goal-progress", element: <EditGoalProgress />},
      { path: "explore", element: <Explore />},
      { path: "notifications", element: <NotificationsPage />},
      { path: "goals", element: <Goals />}
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










