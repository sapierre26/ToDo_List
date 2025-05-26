import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [userPic, setUserPic] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Fetch user info on mount
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
        setEmail(data.email);
        setName(data.name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  // Submit profile changes (optional: implement in backend)
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, name }),
      });

      const result = await res.json();
      if (res.ok) setMessage("Profile updated successfully!");
      else setMessage(result.message || "Failed to update profile");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

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
        setUserPic(`http://localhost:8000${data.image}`); // updated image path
        setMessage("Profile picture updated!");
      } else {
        setMessage("Image upload failed.");
      }
    } catch (err) {
      console.error("Image upload error", err);
      setMessage("Server error during upload.");
    }
  };

  
  return (
    <div className="UserProfile">
      <h2>User Profile</h2>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          {userPic ? (
            <img
              src={userPic}
              alt="Profile"
              style={{ height: "200px", width: "200px", objectFit: "cover" }}
            />
          ) : (
            <div style={{ height: "200px", width: "200px", backgroundColor: "#eee" }} />
          )}
          <input type="file" onChange={handleImageUpload} />
        </div>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <br />
          <label>Username:</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <button onClick={handleSave}>Save Changes</button>
          {message && <p>{message}</p>}
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <button style={{ color: "red" }}>Delete My Account</button>
        <button onClick={() => window.location.href = "mailto:support@example.com"}>
          Contact Support
        </button>
        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
