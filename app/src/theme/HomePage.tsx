import {Link} from "react-router-dom"

export const HomePage = () => {
  return (
    <div>
      <div>Home Page</div>
      <Link to="/login">Login</Link>
    </div>
  )
}
