const express = require('express');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('cloudinary').v2;
const { register, login, updateProfilePicture , getUser , getProfile , getProfileById , getAllUsers , updateUser , updateUserProfile , downloadProfile , sendConnectionRequest , getMyConnectionRequests , whatAreMyConnections , acceptConnectionRequest , requestalreadysent} = require('../controllers/user.controller');
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
router.post('/getProfile',getProfile)
router.get('/get_all_users',getAllUsers)
router.post('/update_profile_data',updateUserProfile)
router.post("/get_profile_by_id", getProfileById);
router.get('/download_profile/:id', downloadProfile);
router.post('/send_connection_request',sendConnectionRequest)
router.post('/request_already_sent',requestalreadysent)
router.post('/getConnectionRequests',getMyConnectionRequests)
router.post('/user_connection_request',whatAreMyConnections)
router.post('/accept_connection_request',acceptConnectionRequest)
module.exports = router;