const express = require('express');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('cloudinary').v2;
const { register, login, updateProfilePicture , getUser , getAllUsers , updateUser , updateUserProfile , downloadProfile , sendConnectionRequest , getMyConnectionRequests , whatAreMyConnections , acceptConnectionRequest} = require('../controllers/user.controller');
const router = express.Router();
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "uploads",
      allowed_formats: ["jpg", "png", "jpeg"],
    }, 
});
const upload = multer({ storage });
router.post('/register', register);
router.post('/update_profile_picture', upload.single("image"), updateProfilePicture);
router.post('/login', login);
router.post('/user_update', updateUser);
router.get('/get_user_and_profile',getUser)
router.get('/get_all_users',getAllUsers)
router.post('/update_profile_data',updateUserProfile)
router.get('/download_profile/:id', downloadProfile);
router.post('/send_connection_request',sendConnectionRequest)
router.get('/getConnectionRequests',getMyConnectionRequests)
router.get('/user_connection_request',whatAreMyConnections)
router.post('/accept_connection_request',acceptConnectionRequest)
module.exports = router;