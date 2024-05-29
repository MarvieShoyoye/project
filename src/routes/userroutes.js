const express = require("express");
const UserModel = require("../models/usermodel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const isAuth = require("../middleware/auth");
const NewsModel = require("../models/newsmodel");
const SendEmail = require("../mailer/mailer");

const router = express.Router();


const {
    userSignup,
    userVerification,
    userLogin,
    getUserProfile,
    updateUserInfo,
    deleteUserAccount,
    userLogout,
} = require("../controllers/usercontroller");


///USER SIGNUP
router.post("/signup", userSignup);

//USER VERIFICATION
router.post("/verify", userVerification);

//USER LOGIN 
router.post("/login", userLogin);

//GETUSER  PROFILE
router.get("/profile", isAuth, getUserProfile);

//UPDATE USER INFORMATION
router.put("/update/:email", isAuth, updateUserInfo);

//DELETE ACCOUNT
router.delete("/delete/:id", isAuth, deleteUserAccount);

//USER LOGOUT
router.post("/logout/:email", isAuth, userLogout);


module.exports = router;