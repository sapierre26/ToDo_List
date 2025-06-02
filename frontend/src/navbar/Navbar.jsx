import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ profilePic }) => {
  return (
    <div className="navbar">
      <Link to="/UserProfile">
        <img
          src={profilePic}
          alt="Profile"
          className="navbar-profile-pic"
        />
      </Link>
    </div>
  );
};

export default Navbar;
