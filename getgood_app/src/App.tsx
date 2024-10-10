import React from "react";
import MyGoalsPage from "./pages/MyGoalsPage";
import Toolbar from "./components/Toolbar";
import ErrorPage from "./pages/ErrorPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";


const dashboardStyle : React.CSSProperties = {
  marginLeft: '7%',
  padding: '20px',
  height: '100vh',
  boxSizing: 'border-box',
  overflow: 'auto',
};

const Dashboard = () => {
  return (
    <div>
      <Toolbar />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [{ path: "MyGoalsPage", element: <MyGoalsPage /> }],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
