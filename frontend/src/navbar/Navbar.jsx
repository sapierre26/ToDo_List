import { Link } from "react-router-dom";
import "./Navbar.css";
import PropTypes from "prop-types";

const Navbar = ({ profilePic }) => {
  return (
    <div className="navbar">
      <Link to="/UserProfile">
      <div className="profile-pic-container">
      </div>
      </Link>
    </div>
  );
};

Navbar.propTypes = {
  profilePic: PropTypes.string,
};
export default Navbar;
