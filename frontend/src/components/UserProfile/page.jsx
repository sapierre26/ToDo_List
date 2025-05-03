import React, {useState, useEffect} from "react"
import "./userProfile.module.css";

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
    // const [username, setUsername] = useState("");
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
          const mockUserData = {
            name: "Manmeet Gill",
            username: "manmeetg18",
            password: "apple@10",
            email: "mgill17@calpoly.edu",
          };
    
          const fetchMock = () => Promise.resolve(mockUserData);
    
          try {
            const data = await fetchMock();
            setUserData(data);
          } catch (err) {
            console.log("FETCHING USER: ", err)
          }
        };
    
        fetchUser();
      }, []);

    /*masking the email*/
    const maskEmail = (email) => {
        if (!email || !email.includes('@')) return "";
        const [local, domain] = email.split("@");
        console.log(`${local}`);
        if (local.length <= 3) return "***@" + domain;

        const visibleEmail = local.slice(0, 3);
        const mask = "*".repeat(local.length -4);
        console.log(`${visibleEmail}${mask}@${domain}`);
        return `${visibleEmail}${mask}@${domain}`;
    }
    return (
        <div className="UserProfile">
            <h2>User Profile</h2>
            <div className="UserSettings" style={{display: "flex"}}>
                <div className="UserInfo" style={{paddingInlineEnd: "3rem"}}>
                    <div className="UserPic">
                    {userPic ? 
                    (<img 
                        src={userPic} 
                        style={{
                            height: "300px",
                            width: "350px",
                            borderRadius: "25px",
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
                        <span className="Username">{userData?.name}</span>
                    </h2>
                </div>
                <div className="UserChangeInfo">
                    
                    <input
                        type="text"
                        value={userData?.username || ""}
                        disabled
                    />
                    <input 
                        type="password"
                        autoComplete="current-password webauthn"
                        value={userData?.password || ""}
                        disabled
                    />
                    <input 
                        type="email"
                        value={maskEmail(userData?.email) || ""}
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