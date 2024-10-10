import React from "react";
import MyGoalsPage from "./pages/MyGoalsPage";
import Toolbar from "./components/Toolbar";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AccountManagement from "./pages/AccountManagement";
import CreateGoalPage from "./pages/CreateGoalPage";
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";


const dashboardStyle : React.CSSProperties = {
  marginLeft: '7%',
  padding: '20px',
  height: '100vh',
  boxSizing: 'border-box',
  overflow: 'auto',
};

const pageContentStyle: React.CSSProperties = {
  width: '93%',
  padding: '20px',
  boxSizing: 'border-box',
  overflow: 'auto',
};

const Dashboard  = () => {
  return (
    <div style={dashboardStyle}>   
      <Toolbar />
      <div style={pageContentStyle}>
        <Outlet />
      </div> 
    </div>
  );
};

const router = createBrowserRouter([
  {path: "/", element: <Login />, errorElement: <ErrorPage />
  },
  

  {path: "/SignUp", element: <SignUp />},

  {
    path: "/Dashboard",
    element: <Dashboard />,
    children: [
      { path: "MyGoalsPage", element: <MyGoalsPage /> },
      { path: "CreateGoalPage", element: <CreateGoalPage /> },
      { path: "AccountManagment", element: <AccountManagement /> }
    ],
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
