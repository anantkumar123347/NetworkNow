const Post = require("../models/posts.model");
const User = require("../models/user.model");
const Comment=require("../models/comments.model")
const basiccontroller = (req, res) => {
    try {
        res.status(200).json("Looks fine about routes");
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const { token, body } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        if (!body) {
            return res.status(400).json({ message: "Post content or media is required" });
        }

        const post = new Post({
            userId: user._id,
            body: body || "",
            media: req.file ? req.file.path : "",
            fileType: req.file ? req.file.mimetype : ""
        });

        await post.save();

        return res.status(200).json({ message: "Post created successfully", post });
    } catch (error) {
        console.error("Error in creating post:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const getAllPosts=async (req,res)=>{
    try{
        const posts=await Post.find().populate('userId' , 'name username email profilePicture')
        return res.json({posts})
    } catch (error) {
        console.error("Error in creating post:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const deletePost=async(req,res)=>{
    try{
        const {token , post_id}=req.body
        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        const post=await Post.findOne({_id:post_id})
        if(!post)
        {
            return res.status(404).json({message:"Post is not found"})
        }
        if(post.userId.toString()!==user._id.toString())
        {
            return res.status(404).json({message:"Unauthorized"})
        }
        await Post.deleteOne({_id:post_id})
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in creating post:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const get_comment_by_post = async (req, res) => {
    try {
      const { post_id } = req.body;
  
      const post = await Post.findById(post_id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const comments = await Comment.find({ postId: post_id }).populate("userId", "name profilePicture");
  
      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
const delete_comment=async(req,res)=>{
    try{
        const {token , comment_id}=req.body
        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        const comment=await Comment.findOne({_id:comment_id})
        if(!comment)
        {
            return res.status(404).json({message:"Comment is not found"})
        }
        if(comment.userId.toString()!==user._id.toString())
        {
            return res.status(404).json({message:"Unauthorized"})
        }
        await Comment.deleteOne({_id:comment_id})
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error in deleting comment:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const commentPost=async(req,res)=>{
    try{
        const { token , post_id , commentbody } = req.body;
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "User not found" });
        const post=await Post.findOne({_id:post_id})
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment=new Comment({
            userId:user._id,
            postId:post._id,
            body:commentbody
        })
        await comment.save();
        return res.status(200).json({message:"Comment saved"});
    }catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
const increment_likes=async(req,res)=>{
    try{
        const {post_id}=req.body
        const post=await Post.findOne({_id:post_id})
        if(!post)
        {
            return res.status(404).json({message:"Post is not found"})
        }
        post.likes=post.likes+1
        await post.save()
        return res.status(200).json({ message: "Likes incremented successfully" });
    } catch (error) {
        console.error("Error in deleting comment:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const getUserPosts = async (req, res) => {
    const { userId } = req.body;
  
    try {
      if (!userId) return res.status(400).json({ message: "User ID is required" });
  
      const posts = await Post.find({ userId }).sort({ createdAt: -1 });
  
      res.json({ posts });
    } catch (err) {
      console.error("Error fetching user posts:", err);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  };
  
module.exports = { basiccontroller, createPost , getAllPosts , deletePost , get_comment_by_post , commentPost , delete_comment , increment_likes , getUserPosts};
