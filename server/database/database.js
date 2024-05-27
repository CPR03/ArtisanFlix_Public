const mongoose = require("mongoose");

// Define user schema
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true}
        ,
        email: String,
        password: String,
        role: {
            type: String,
            enum: ["normal", "admin"], // Enumerated field for user roles
            default: "normal", // Default role is normal user
        },
        created_at: {
            type: Date,
        },
    },
    {versionKey: false}
);

// Define video schema
const videoSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        created_by: {
            type: String,
            default: "N/A",
        },
        url: String,
        thumbnail: String,
        uploaded_at: {
            type: Date,
        },
    },
    {versionKey: false}
);

const User = mongoose.model("User", userSchema);
const Video = mongoose.model("Video", videoSchema);

module.exports = {User, Video};
