const Post = require("../models/posts.model");
const User = require("../models/user.model");

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
/*const getAllPosts=await (req,res)=>{
    try{

    } catch (error) {
        console.error("Error in creating post:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}*/
module.exports = { basiccontroller, createPost };
