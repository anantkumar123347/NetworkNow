const cloudinary = require('cloudinary').v2;

const connectCloud = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });

        console.log('Connected to Cloudinary successfully');
    } catch (error) {
        console.error('Error connecting to Cloudinary:', error.message);
    }
};

module.exports = connectCloud;
