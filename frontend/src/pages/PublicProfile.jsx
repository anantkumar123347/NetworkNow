import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import "./PublicProfile.css";

function PublicProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/get_profile_by_id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          setProfile(data.profile);
        } else {
          console.error("Error:", data.msg);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts/get_user_posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
        } else {
          console.error("Failed to fetch posts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const handleResumeDownload = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/download_profile/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${user?.name || "profile"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  if (!user || !profile) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="cover-photo" />

      <div className="profile-picture-wrapper">
        <div className="profile-picture-box">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="profile-picture"
          />
        </div>
      </div>

      <div className="profile-info">
        <h2>{user.name}</h2>
        <h4>@{user.username}</h4>
        <p>{profile.bio || "No bio available."}</p>
        <p><strong>Current Post:</strong> {profile.currentPost || "N/A"}</p>

        <h3>Work Experience</h3>
        {profile.pastWork?.length > 0 ? (
          profile.pastWork.map((work, idx) => (
            <p key={idx}>
              <strong>{work.company}</strong> - {work.postion}, {work.years}
            </p>
          ))
        ) : (
          <p>No work history provided</p>
        )}

        <h3>Education</h3>
        {profile.education?.length > 0 ? (
          profile.education.map((edu, idx) => (
            <p key={idx}>
              <strong>{edu.school}</strong> - {edu.degree}, {edu.fieldOfStudy}
            </p>
          ))
        ) : (
          <p>No education info provided</p>
        )}

        <div className="profile-actions">
          <button className="connect-button">Connect</button>
          <button className="download-button" onClick={handleResumeDownload}>
            Download Resume
          </button>
        </div>
        <br />
        <br />
        <hr />
        <br />
        <br />
        <h3>Recent Activities</h3>
<div className="allposts-container">
  {posts.length > 0 ? (
    posts.map((post) => (
      <div key={post._id} className="post-card">
        <div className="post-user">
          <img src={user.profilePicture} alt={user.name} />
          <p><strong>{user.name}</strong></p>
        </div>
        <hr />
        <p className="post-body">{post.body}</p>
        {post.media && (
          <div className="post-media">
            {post.fileType?.startsWith("image") ? (
              <img src={post.media} alt="Post Media" className="post-image" />
            ) : post.fileType?.startsWith("video") ? (
              <video controls className="post-video">
                <source src={post.media} type={post.fileType} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <a href={post.media} target="_blank" rel="noopener noreferrer" className="post-file-link">
                View Attached File
              </a>
            )}
          </div>
        )}
        <p className="timestamp">Posted on: {new Date(post.createdAt).toLocaleString()}</p>
      </div>
    ))
  ) : (
    <p>No recent activities.</p>
  )}
</div>

      </div>
    </div>
  );
}

export default PublicProfile;
