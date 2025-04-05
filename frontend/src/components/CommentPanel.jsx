import React, { useEffect, useState } from "react";
import "./CommentPanel.css";

export default function CommentPanel({ postId, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    }
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/posts/get_comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
    setLoading(false);
  };

  const handlePostComment = async () => {
    if (!commentBody.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          post_id: postId,
          commentbody: commentBody,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCommentBody("");
        fetchComments();
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  return (
    <div className="comment-popup-overlay" onClick={onClose}>
      <div className="comment-popup-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Comments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <strong>{comment.userId?.name || "Anonymous"}</strong>
              <p>{comment.body}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        <div className="comment-input-box">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <button className="post-btn" onClick={handlePostComment}>Post</button>
        </div>

        <button className="close-popup-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
