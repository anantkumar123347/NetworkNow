import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import CommentPanel from "./CommentPanel";
import CreatePost from "./CreatePost";
import "./Allposts.css";

function Allposts() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://networknow-1.onrender.com/posts/getAllPosts");
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const increaseLike = async (postId) => {
    try {
      const response = await fetch("https://networknow-1.onrender.com/posts/increment_post_like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error("Error increasing likes:", error);
    }
  };

  return (
    <>
      <CreatePost onPostSuccess={fetchPosts} />
      <div className="allposts-container">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-user">
              <img src={post.userId.profilePicture} alt={post.userId.name} />
              <p><strong>{post.userId.name}</strong></p>
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
                ) : null}
              </div>
            )}
            <hr />
            <div className="post-actions">
              <button onClick={() => increaseLike(post._id)}><FaThumbsUp /> {post.likes}</button>
              <button onClick={() => setSelectedPostId(post._id)}><FaComment /></button>
              <button onClick={() => window.open("https://x.com", "_blank")}><FaShare /></button>
            </div>

            {selectedPostId === post._id && (
              <CommentPanel
                postId={post._id}
                onClose={() => setSelectedPostId(null)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Allposts;
