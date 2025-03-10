const express = require('express');
const router = express.Router();
const { basiccontroller , createPost } = require('../controllers/posts.controller.js');
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
router.get('/getAllPosts',)
router.get('/', basiccontroller);
module.exports = router