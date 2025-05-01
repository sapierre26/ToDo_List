import React, {useState, useEffect} from "react"
import "./userProfile.module.css";

const UserProfile = () => {
    const user = {
        name: 'Manmeet Gill',
        username: 'manmeetg18',
        password: 'apple@10',
    }
    //handle image upload
    const [userPic, setUserPic] = useState(null);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserPic(URL.createObjectURL(file));
        }
    }

    //fetch username and password (let"s see how we can do this)
    const [username, setUsername] = useState("");
    
    return (
        <div className="UserProfile">
            <h2>User Profile</h2>
            <div className="UserSettings" style={{display: "flex"}}>
                <div className="UserInfo" >
                    <div className="UserPic">
                    {userPic ? 
                    (<img 
                        src={userPic} 
                        style={{
                            height: "300px",
                            width: "350px",
                            paddingRight: "2rem",
                        }}
                        alt="profilePicture"
                    />) : 
                        (<span></span>)}
                        <label className="Filebox">
                            <input 
                                type="file"
                                className="FileInput"
                                onChange={(handleImageUpload)}
                                style={{
                                    padding: "2px",
                                    width: "15rem",
                                    display: "flex"
                                }}
                            />
                        </label>
                    </div>
                    <h2>
                        <span className="Username">{user.name}</span>
                    </h2>
                </div>
                <div className="UserChangeInfo">
                    
                    <input
                        type="text"
                        value={user.username}
                        disabled
                    />
                    <input 
                        type="password"
                        autocomplete="current-password webauthn"
                        value={user.password}
                        disabled
                    />
                    <input 
                        type="email"
                        placeholder="Email"
                        disabled
                    />
                </div>
            </div>
            <div className="support">
                <button>Delete my account</button>
                <button>Contact support via email</button>
                <button>Log out</button>
            </div>
        </div> 

    );
}

export default UserProfile;