const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["admin", "user", "guest"],
        default: "user",
    },
    starredNews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News"
    }
},
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;