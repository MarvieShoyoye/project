const express = require("express");
const AdminModel = require("../models/adminmodel");
const argon2 = require("argon2");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const isAuth = require("../middleware/auth");
const UserModel = require("../models/usermodel");
const SendEmail = require("../mailer/mailer");


const router = express.Router();

const {
    adminCreation,
    adminVerification,
    adminLogin,
    getAdminProfile,
    updateAdminInfo,
    deleteAdmin,
    adminLogout,
    disableUser,
} = require("../controllers/admincontroller");

//ADMIN ACCOUNT CREATION 
router.post("/create", adminCreation);


//ADMIN VERIFICATION
router.post("/verify", adminVerification);


/// ADMIN LOGIN
router.post("/login", adminLogin);


//GET ADMIN PROFILE
router.get("/profile", isAuth, getAdminProfile);


// UPDATE ADMIN INFOMATION
router.put("/update/:email", isAuth, updateAdminInfo);


//DELETE ADMIN ACCOUNT
router.delete("/delete/:id", isAuth, deleteAdmin);


//ADMIN LOGOUT
router.post("/logout/:email", isAuth, adminLogout);



//DISABLE A USER USING THE PUT VERB
router.put("/:users/disable", isAuth, disableUser);




module.exports = router;