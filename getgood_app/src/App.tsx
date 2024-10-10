import React from 'react';
import Toolbar from './components/Toolbar';
import ErrorPage from './pages/ErrorPage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import { createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';

// this will help to render the Toolbar on every page and its appropritae child path (page)
const Dashboard = () =>  {

  const dashboardStyle : React.CSSProperties = {
    marginLeft: '7%',
    padding: '20px',
    height: '100vh',
    boxSizing: 'border-box',
    overflow: 'auto',
  };

  return (
    <div style = {dashboardStyle}>
      <Toolbar/>
      <Outlet/>
    </div>
  );
}

{/* routing for each of the pages in the app */}
const router = createBrowserRouter([
  // note: / is root path (entery point)
  {path: '/', 
  element: <Dashboard/>, 
  errorElement: <ErrorPage/>,
  children: [

      {path: 'Page1', element: <Page1/>},
      {path: 'Page2', element: <Page2/>},
      {path: 'Page3', element: <Page3/>},
      {path: 'Page4', element: <Page4/>},
      {path: 'Page5', element: <Page5/>}, 
      
    ]
  } 
]);

function App() {
  return (
    <div>
      {/* render the appropiate pages/elements */}
      <RouterProvider router={router} />

    </div>
  );
}



export default App;
