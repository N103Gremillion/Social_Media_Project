import React from "react"
import { Link } from "react-router-dom"

const ErrorPage = () => {
  return (
    <div>
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'grey', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        404 Not Found
        {/* Link back to the root page */}
        <Link to="/"> Home form link </Link>
      </div>
    </div>
  );
};

export default ErrorPage