import React, {useState} from 'react'

const UserProfile = () => {
    const [userPic, setUserPic] = useState(null);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserPic(URL.createObjectURL(file));
        }
    }
    return (
        <div className='UserProfile'>
            <h2>User Profile</h2>
            <div className='UserSettings' style={{display: 'flex'}}>
                <div className='UserInfo'>
                    <div className='UserPic'>
                    {userPic ? 
                    (
                        <img src={userPic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />) : 
                        (
                        <span>Upload</span>
)}
                        <input 
                            type="file"
                            onChange={(handleImageUpload)}
                        />
                    </div>
                    <label>Name</label>
                </div>
                <div className='UserChangeInfo'>
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
            <div className='support'>
                <button>Delete my account</button>
                <button>Contact support via email</button>
                <button>Log out</button>
            </div>
        </div> 

    );
}

export default UserProfile;