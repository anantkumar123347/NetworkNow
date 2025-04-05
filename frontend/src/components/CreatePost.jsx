import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./CreatePost.css";

function CreatePost({ onPostSuccess }) {
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
    formData.append("body", postText);
    if (file) {
      formData.append("media", file);
    }

    try {
      const response = await fetch("http://localhost:5000/posts/createPost", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("✅ Posted successfully!");
        setPostText("");
        setFile(null);

        // Clear the message after 2 seconds
        setTimeout(() => setSuccessMessage(""), 2000);

        // Call parent's function to refresh posts
        if (onPostSuccess) onPostSuccess();
      } else {
        console.error("Post error:", result.message);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="createpostform">
        <textarea
          placeholder="What's in your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="create-post-input"
          rows={1}
        />
        <label htmlFor="file-upload" className="createpostfile">
          <FaPlus size={20} />
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button>Post</button>
      </form>

      {successMessage && <p style={{ color: "green", marginTop: "8px" }}>{successMessage}</p>}
    </>
  );
}

export default CreatePost;
