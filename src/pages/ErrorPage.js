import React from "react"
import { Link } from "react-router-dom"

const ErrorPage = () => {
  return (
    <div>
        404 Not Found
        {/* Link back to the root page */}
        <Link to="/"> Home form link </Link>
    </div>
  )
}

export default ErrorPage