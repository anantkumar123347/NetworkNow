const express = require('express');
const router = express.Router();
const { basiccontroller , createPost , getAllPosts , deletePost , commentPost , delete_comment , get_comment_by_post , increment_likes} = require('../controllers/posts.controller.js');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('cloudinary').v2;
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "uploads",
      resource_type: "auto",
    }, 
});
const upload = multer({ storage });
router.post('/createPost',upload.single("media"),createPost)
router.get('/getAllPosts', getAllPosts)
router.get('/', basiccontroller);
router.delete('/delete_post',deletePost)
router.post("/comment",commentPost)
router.get("/get_comments",get_comment_by_post)
router.delete("/delete_comment",delete_comment)
router.post("/increment_post_like",increment_likes)
module.exports = router