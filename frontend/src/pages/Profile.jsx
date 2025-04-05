import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaPen } from "react-icons/fa";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  const [userForm, setUserForm] = useState({ name: "", username: "", email: "" });
  const [profileForm, setProfileForm] = useState({
    bio: "",
    currentPost: "",
    pastWork: [],
    education: [],
  });

  const [newWork, setNewWork] = useState({ company: "", postion: "", years: "" });
  const [newEducation, setNewEducation] = useState({ school: "", degree: "", fieldOfStudy: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/user/getProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      setProfile(data.profile);
      setUser(data.user);
      setUserForm({ name: data.user.name, username: data.user.username, email: data.user.email });
      setProfileForm({
        bio: data.profile.bio || "",
        currentPost: data.profile.currentPost || "",
        pastWork: data.profile.pastWork || [],
        education: data.profile.education || [],
      });
    };

    fetchProfile();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("token", localStorage.getItem("token"));

    const res = await fetch("http://localhost:5000/user/update_profile_picture", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setUser((prev) => ({ ...prev, profilePicture: data.profilePicture }));
    }
  };

  const handleUserUpdate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/user/user_update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userForm.name,
        username: userForm.username,
        email: userForm.email,
        token: token,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.updatedUser);
      setShowUserForm(false);
    } else {
      alert(data.message || "Update failed");
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/user/update_profile_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profileForm, token }),
    });

    const data = await res.json();
    if (res.ok) {
      setProfile(data.updatedProfile);
      setShowProfileForm(false);
    } else {
      alert(data.message || "Profile update failed.");
    }
  };

  const addWork = () => {
    setProfileForm({ ...profileForm, pastWork: [...profileForm.pastWork, newWork] });
    setNewWork({ company: "", postion: "", years: "" });
  };

  const addEducation = () => {
    setProfileForm({ ...profileForm, education: [...profileForm.education, newEducation] });
    setNewEducation({ school: "", degree: "", fieldOfStudy: "" });
  };

  if (!user || !profile) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="cover-photo" />

      <div className="profile-picture-wrapper">
        <div
          className="profile-picture-box"
          onClick={() => document.getElementById("profileImageInput").click()}
        >
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          <div className="edit-overlay">
            <FaPen size={14} />
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          id="profileImageInput"
          style={{ display: "none" }}
          onChange={handleProfilePictureChange}
        />
      </div>

      <div className="profile-info">
        <h1>{user.name}</h1>
        <h3>@{user.username}</h3>
        <p>{profile.bio || "No bio yet."}</p>
        <p><strong>Current Post:</strong> {profile.currentPost || "Not specified."}</p>

        <h2>Education</h2>
        {profile.education.length > 0 ? (
          profile.education.map((edu, idx) => (
            <div key={idx}>
              <strong>{edu.school}</strong> - {edu.degree}, {edu.fieldOfStudy}
            </div>
          ))
        ) : (
          <p>No education info.</p>
        )}

        <h2>Work History</h2>
        {profile.pastWork.length > 0 ? (
          profile.pastWork.map((work, idx) => (
            <div key={idx}>
              <strong>{work.company}</strong> - {work.postion}, {work.years}
            </div>
          ))
        ) : (
          <p>No work history yet.</p>
        )}

        <div className="action-buttons">
          <button onClick={() => setShowUserForm(!showUserForm)}>Update User Info</button>
          <button onClick={() => setShowProfileForm(!showProfileForm)}>Update Profile Info</button>
        </div>

        {showUserForm && (
          <div className="form-section">
            <h3>Update User Info</h3>
            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Username"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
            <button onClick={handleUserUpdate}>Submit</button>
          </div>
        )}

        {showProfileForm && (
          <div className="form-section">
            <h3>Update Profile Info</h3>
            <input
              type="text"
              placeholder="Bio"
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            />
            <input
              type="text"
              placeholder="Current Post"
              value={profileForm.currentPost}
              onChange={(e) => setProfileForm({ ...profileForm, currentPost: e.target.value })}
            />

            <h4>Add Work</h4>
            <input
              type="text"
              placeholder="Company"
              value={newWork.company}
              onChange={(e) => setNewWork({ ...newWork, company: e.target.value })}
            />
            <input
              type="text"
              placeholder="Postion"
              value={newWork.postion}
              onChange={(e) => setNewWork({ ...newWork, postion: e.target.value })}
            />
            <input
              type="text"
              placeholder="Years"
              value={newWork.years}
              onChange={(e) => setNewWork({ ...newWork, years: e.target.value })}
            />
            <button onClick={addWork}>Add Work</button>

            <h4>Add Education</h4>
            <input
              type="text"
              placeholder="School"
              value={newEducation.school}
              onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
            />
            <input
              type="text"
              placeholder="Degree"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={newEducation.fieldOfStudy}
              onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
            />
            <button onClick={addEducation}>Add Education</button>

            <button onClick={handleProfileUpdate}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
