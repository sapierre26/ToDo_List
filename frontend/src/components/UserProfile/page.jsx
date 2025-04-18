import React, {useState, useEffect} from "react"

const UserProfile = () => {
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
                <div className="UserInfo">
                    <div className="UserPic">
                    {userPic ? 
                    (<img 
                        src={userPic} 
                        alt="profilePicture"
                        style={{
                            height: "300px",
                            width: "350px"
                        }}
                    />) : 
                        (<span></span>)}
                        <input 
                            type="file"
                            onChange={(handleImageUpload)}
                            style={{
                                width: "45%"
                            }}
                        />
                    </div>
                    <h2>
                        <span className="Username">Name</span>
                    </h2>
                </div>
                <div className="UserChangeInfo">
                    
                    <input
                        type="text"
                        placeholder="Username"
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                    />
                    <input 
                        type="email"
                        placeholder="Email"
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