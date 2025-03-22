const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const Connection=require("../models/connections.model")
const bcrypt = require("bcrypt");
const crypto=require('crypto');
const PDFDocument=require('pdfkit')
const axios = require('axios');
const fs=require('fs');
const Post = require("../models/posts.model");
const { use } = require("../routes/posts.route");
const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "Send all fields" });
        }
        const doesExist = await User.findOne({ email });
        if (doesExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        await newUser.save();
        const newProfile = new Profile({ userId: newUser._id });
        await newProfile.save();

        return res.status(201).json({ message: "Successfully registered new user" });
    } catch (error) {
        console.error("Error in registration:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const login = async (req, res) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Send all fields" });
        }
        const doesExist = await User.findOne({ email });
        if (!doesExist) {
            return res.status(404).json({ message: "User doesn't exists" });
        }
        const ismatch=await bcrypt.compare(password,doesExist.password)
        if(!ismatch)
        {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token=crypto.randomBytes(32).toString('hex')
        await User.updateOne({_id:doesExist._id},{token})
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error in registration:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }
        const profilePicture = req.file.path; 
        const {token} = req.body;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const doesExist = await User.findOne({ token });
        if (!doesExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        await User.updateOne({ token }, { profilePicture });
        return res.status(200).json({ message: "Profile picture updated successfully", profilePicture });
    } catch (error) {
        console.error("Error updating profile picture:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const getUser = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const updateUser = async (req, res) => {
    try {
        const { name, username, email } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { token },
            { name, username, email },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const updateUserProfile = async (req, res) => {
    try {
        const { token, bio, currentPost, pastWork, education } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: user._id },
            { bio, currentPost, pastWork, education },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({ message: "Profile updated successfully", updatedProfile });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const downloadProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userProfile = await Profile.findOne({ userId }).populate("userId");
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=profile_${userId}.pdf`);

        doc.pipe(res);
        if (userProfile.userId.profilePicture) {
            const imageUrl = userProfile.userId.profilePicture;
            const imagePath = 'temp_profile.jpg';
            const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, response.data);

            doc.image(imagePath, {
                fit: [150, 150],
                align: 'center'
            });

            fs.unlinkSync(imagePath);
            doc.moveDown();
        }
        doc.fontSize(20).text("User Profile", { align: 'center' });
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.fontSize(14).text(`Name: ${userProfile.userId.name}`);
        doc.fontSize(14).text(`Username: ${userProfile.userId.username}`);
        doc.fontSize(14).text(`Email: ${userProfile.userId.email}`);
        doc.moveDown();
        doc.fontSize(16).text("Bio & Current Position", { underline: true });
        doc.fontSize(14).text(`Bio: ${userProfile.bio}`);
        doc.fontSize(14).text(`Current Position: ${userProfile.currentPost}`);
        doc.moveDown();
        doc.fontSize(16).text("Work Experience", { underline: true });
        if (userProfile.pastWork.length === 0) {
            doc.fontSize(14).text("No work experience available.");
        } else {
            userProfile.pastWork.forEach((work, index) => {
                doc.fontSize(14).text(`${index + 1}. Company: ${work.company}`);
                doc.fontSize(14).text(`   Position: ${work.postion}`);
                doc.fontSize(14).text(`   Years: ${work.years}`);
                doc.moveDown();
            });
        }
        doc.fontSize(16).text("Education", { underline: true });
        if (userProfile.education.length === 0) {
            doc.fontSize(14).text("No education details available.");
        } else {
            userProfile.education.forEach((edu, index) => {
                doc.fontSize(14).text(`${index + 1}. School: ${edu.school}`);
                doc.fontSize(14).text(`   Degree: ${edu.degree}`);
                doc.fontSize(14).text(`   Field of Study: ${edu.fieldOfStudy}`);
                doc.moveDown();
            });
        }

        doc.end();
    } catch (error) {
        console.error("Error generating profile PDF:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const sendConnectionRequest= async (req,res)=>{
    try
    {
        const {token,connectionId}=req.body
        const sender=await User.findOne({token})
        if(!sender)
        {
            return res.status(404).json({ message: "User not found" });
        }
        const reciever=await User.findOne({_id:connectionId})
        if(!reciever)
        {
            return res.status(404).json({ message: "Reciever not found" });
        }
        const request=await Connection.findOne({userId:sender._id,
            connectionId:reciever._id
        })
        if(request)
        {
            return res.status(404).json({ message: "Request already sent" });
        }
        const newrequest=new Connection({userId:sender._id,
            connectionId:reciever._id})
        await newrequest.save()
        return res.status(200).json({message:"Request sent sucessfully"})
    } catch (error) {
        console.error("Error generating profile PDF:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const getMyConnectionRequests = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "User not found" });
        const requests = await Connection.find({ userId: user._id }).populate("connectionId", "name username email profilePicture");
        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const whatAreMyConnections=async (req,res)=>{
    try {
        const { token } = req.body;
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "User not found" });
        const requests = await Connection.find({ connectionId: user._id }).populate("userId", "name username email profilePicture");
        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
const acceptConnectionRequest=async(req,res)=>{
    try {
        const { token , requestId , action_type } = req.body;
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "User not found" });
        const requests = await Connection.findOne({_id:requestId})
        if(!requests)
        {
            return res.status(404).json({ message: "Reciever not found" });
        }
        if(action_type=="accept")
        {
            requests.status_accepted=true;
        }
        else
        {
            requests.status_accepted=false;
        }
        await requests.save()
        return res.status(200).json({message:"Request updated"});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { register , login , updateProfilePicture , getUser , getAllUsers , updateUser , updateUserProfile , downloadProfile , sendConnectionRequest , getMyConnectionRequests , whatAreMyConnections , acceptConnectionRequest};
