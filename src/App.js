import React from 'react';
import Toolbar from './components/Toolbar';
import ErrorPage from './pages/ErrorPage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


function App() {
  return (
      <div>

        {/* render the appropiate pages/elements */}
        <RouterProvider router={router} />

      </div>

  );
}

{/* routing for each of the pages in the app */}
const router = createBrowserRouter([
  {
    // note: / is root path (entery point)
    path: '/',
    element: <Toolbar/>,
    // if there is an error add it to the root component
    errorElement: <ErrorPage/>,
  },
  {
    // note: / is root path (entery point)
    path: '/pages/Page1',
    element: <Page1/>,
    // if there is an error add it to the root component
    errorElement: <ErrorPage/>,
  },
  {
    path: '/pages/Page2',
    element: <Page2 />,
  },
  {
    path: '/pages/Page3',
    element: <Page3 />,
  },
  {
    path: '/pages/Page4',
    element: <Page4 />,
  },
  {
    path: '/pages/Page5',
    element: <Page5 />,
  },
]);

export default App;

