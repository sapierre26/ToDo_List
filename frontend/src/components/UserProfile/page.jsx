import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./userProfile.module.css";
import PropTypes from "prop-types";

const UserProfile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [userPic, setUserPic] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUsername(data.username);
        setName(data.name);
        setEmail(data.email);
        setUserPic(data.image);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [token]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile/image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUserPic(data.image);
        setMessage("Profile picture updated!");
      } else {
        setMessage(data?.msg || "Image upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed.");
    }
  };

  const handleSave = async () => {
    const payload = { username, name, email };
    try {
      const res = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?",
    );
    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:8000/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Account deleted.");
        onLogout();
        navigate("/login");
      } else {
        const result = await res.json();
        setMessage(result?.msg || "Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Error deleting account.");
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className={style.settingsContainer}>
      <div className={style.settingsTop}>
        {/* Profile Picture */}
        <div className={style.profileLeft}>
          <div className={style.profilePicContainer}>
            {userPic ? (
              <img src={userPic} alt="Profile" className={style.profileImage} />
            ) : (
              <div className={style.profilePlaceholder} />
            )}
            <label className={style.overlay}>
              Edit Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* User Info */}
        <div className={style.profileRight}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      {/* Action buttons */}
      <div className={style.settingsActions}>
        <button onClick={handleSave}>Save Settings</button>
        <button className={style.deleteButton} onClick={handleDeleteAccount}>
          Delete My Account
        </button>
        <button onClick={handleLogout}>Log Out</button>
        <button
          onClick={() => (window.location.href = "mailto:support@example.com")}
        >
          Contact Support
        </button>
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
export default UserProfile;
