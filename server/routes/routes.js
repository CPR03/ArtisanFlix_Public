const router = require("express").Router();
const Video = require("../database/database").Video;
const User = require("../database/database").User;
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// !Videos

router.get("/videos", async (req, res) => {
    try {
        const videos = await Video.find().sort({uploaded_at: -1});

        const videosWithFormattedTime = videos.map((video) => {
            const formattedVideo = video.toObject();
            formattedVideo.uploaded_at = moment(video.uploaded_at).tz("Asia/Manila").format("YYYY-MM-DD");
            return formattedVideo;
        });

        res.status(200).json({message: "Data Retrieved!", videos: videosWithFormattedTime});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Create a new video
router.post("/videos", async (req, res) => {
    try {
        const videoData = req.body;
        const uploadedAtPhilippineTime = moment().tz("Asia/Manila").toDate();
        console.log("Uploaded at Philippine Time:", uploadedAtPhilippineTime);

        // Check if a video with the same title and URL already exists
        const existingVideo = await Video.findOne({title: videoData.title, url: videoData.url});
        if (existingVideo) {
            return res.status(400).json({message: "A video with this title and URL already exists!"});
        }

        videoData.uploaded_at = uploadedAtPhilippineTime; // Set uploaded_at to current time in Philippine Time

        const video = new Video(videoData);
        await video.save();

        // Format the uploaded_at field to a simpler format before sending the response
        const formattedUploadedAt = moment(uploadedAtPhilippineTime).tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss Z");

        res.status(201).json({message: "Data Created!", video: {...video.toJSON(), uploaded_at: formattedUploadedAt}});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Delete a video
router.delete("/videos/:id", async (req, res) => {
    try {
        const videoId = req.params.id;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({message: "Video not found"});
        }

        await Video.deleteOne({_id: videoId});

        res.status(200).json({message: "Video deleted!"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update a video
router.put("/videos/:id", async (req, res) => {
    try {
        const videoId = req.params.id;
        const videoData = req.body;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({message: "Video not found"});
        }

        await Video.updateOne({_id: videoId}, {$set: videoData});

        res.status(200).json({message: "Video updated!"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// !USERS

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();

        const usersWithFormattedTime = users.map((user) => {
            const formattedUser = user.toObject();
            formattedUser.created_at = moment(user.created_at).tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss Z");
            return formattedUser;
        });

        res.status(200).json({message: "Data Retrieved!", users: usersWithFormattedTime});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Create a new user
router.post("/users", async (req, res) => {
    try {
        const userData = req.body;
        const createdAtPhilippineTime = moment().tz("Asia/Manila").toDate();
        console.log("Created at Philippine Time:", createdAtPhilippineTime);

        userData.created_at = createdAtPhilippineTime; // Set created_at to current time in Philippine Time

        // Check if username already exists
        const existingUser = await User.findOne({name: userData.name});
        if (existingUser) {
            return res.status(400).json({error: "Username is already taken!"});
        }

        // Hash the password
        try {
            const salt = await bcrypt.genSalt(10);
            const origPassword = userData.password;
            userData.password = await bcrypt.hash(userData.password, salt);

            console.log("Original password:", origPassword);
            console.log("Hashed password:", userData.password);
        } catch (hashError) {
            console.error("Error hashing password:", hashError);
            return res.status(500).json({error: "Error hashing password"});
        }

        const user = new User(userData);
        await user.save();

        // Format the created_at field to a simpler format before sending the response
        const formattedCreatedAt = moment(createdAtPhilippineTime).tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss Z");

        res.status(201).json({message: "Data Created!", user: {...user.toJSON(), created_at: formattedCreatedAt}});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update user details (name, email, password)
router.put("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const {name, email, currPassword, password} = req.body;

        // Find the user
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Assuming `username` is the username you want to check
        const existingUser = await User.findOne({name: name});
        if (existingUser) {
            return res.status(400).json({message: "Username is already taken!"});
        }

        // Check if current password is correct for user profile update verification
        const isMatch = await bcrypt.compare(currPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Wrong/Empty password input!"});
        }

        // Hash the new password if provided
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Prepare updated data
        const updatedData = {
            ...(name && {name: name}),
            ...(email && {email: email}),
            ...(hashedPassword && {password: hashedPassword}), // Include password only if it's provided
        };

        // Update user details
        await User.updateOne({_id: userId}, {$set: updatedData});

        res.status(200).json({message: "User details updated successfully!"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Create jwt token for login
router.post("/login", async (req, res) => {
    try {
        const {name, password} = req.body;

        // Find user with the given name
        const user = await User.findOne({name: name});

        // Check if the user exists
        if (!user) {
            // User not found
            return res.status(400).json({message: "Invalid username or password!"});
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            // Password is incorrect
            return res.status(400).json({message: "Invalid username or password!"});
        }

        // User found and password is correct
        // Generate a JWT
        const token = jwt.sign({id: user._id}, "BDR-BCK-F");

        // Send back user data and token
        return res.status(200).json({message: "Login successful!", user: user, token: token, role: user.role});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Auth Token Verification
router.get("/auth", async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, "BDR-BCK-F");

        // Get the user from the decoded token
        const userId = decoded.id;

        // Find the user with the given ID
        const user = await User.findById(userId);

        if (!user) {
            // User not found
            return res.status(404).json({message: "User not found"});
        }

        // User found
        // Send back user data
        return res.status(200).json({user: user});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
