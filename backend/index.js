const dotenv=require('dotenv')
dotenv.config()
const express = require("express");
const app = express();
const connectDB=require('./config/db.config.js')
const connectCloud=require('./config/cloudinary.config.js')
const cors=require('cors')
const postsroutes=require('./routes/posts.route.js')
const userroutes=require('./routes/user.routes.js')
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    console.log("App is working");
    res.send("App is working");
});
app.use('/posts',postsroutes)
app.use('/user',userroutes)
connectDB()
connectCloud()
app.listen(process.env.PORT, () => {
    console.log(`App is listening at PORT 5000`);
});