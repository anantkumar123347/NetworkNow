const mongoose = require('mongoose');

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to database successfully");
        })
        .catch((error) => {
            console.error("Database connection failed:", error.message);
        });
}

module.exports = connectDB;