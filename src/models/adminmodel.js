const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminName: {
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
        required: true
    },
    otp: {
        type: Number,
        default : true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    },
   
},
    {
        timesstamps: true,
    }
);


const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
