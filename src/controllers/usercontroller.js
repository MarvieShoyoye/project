const express = require("express");
const UserModel = require("../models/usermodel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const isAuth = require("../middleware/auth");
const NewsModel = require("../models/newsmodel");
const SendEmail = require("../mailer/mailer");

///USER SIGNUP
const userSignup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username && !email && !password)
            return res.status(400).json({
                error: " PLEASE FILL ALL FIELDS"
            });

        const validUsername = validator.isAlphanumeric(username)
        const validEmail = validator.isEmail(email);
        const validPassword = validator.isStrongPassword(password);
        if (!validUsername)
            return res.status(400).json({
                error: "PLEASE ENTER AN ALPHANUMERIC USERNAME",
            })
        if (!validEmail)
            return res.status(400).json({
                error: "ENTER A VALID EMAIL",
            });
        if (!validPassword)
            return res.status(400).json({
                error: "PLEASE ENTER A STRONG PASSWORD CONTAINING AN UPPERCASE, LOWERCASE, SPECIAL CHARACTER, AND  AT LEAST 8 DIGITS CHARCTER "
            });

        const UserExist = await UserModel.findOne({ email });
        if (UserExist)
            return res.status(409).json({
                error: "USER ALREADY EXIST",
            })

        const generateRandomOtp = () => {
            const randomNum = Math.random() * 9000;
            const formattedRandomNum = Math.floor(randomNum);
            return formattedRandomNum;
        };
        const hashedPassword = await argon2.hash(password)

        const user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            otp: generateRandomOtp(),
        });
        await SendEmail(
            email,
            "Account Signup",
            `Hi ${user.username} You just signed up`,
            `<body> 
              <p>Name: ${user.username}</p>
              <p>Email: ${user.email}</p>
              <p> Hi ${user.username} you just signed up to citizen times
              I really hope you enjoy our website. 
              </p>
             </body>`
        );
        return res.status(201).json({
            success: true,
            message: "user signedup successfuly",
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

//USER VERIFICATION
const userVerification = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email && !otp)
            return res.status(400).json({ error: "please fill all fields" });
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ error: "user not found" });

        if (user.isVerified)
            return res.status(400).json({ error: "user already verified" });

        if (!user.otp) return res.status(404).json({ error: "otp not found" });

        // verify the user using otp
        if (user.otp != otp) return res.status(400).json({ error: "Invalid otp" });

        user.isVerified = true;
        user.otp = null;
        await user.save();

        return res.status(200).json({ message: "user verified successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" + error });
    }
};


//USER LOGIN
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({
                error: "USER DOES NOT EXIST",
            });

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword)
            return res.status(401).json({
                error: "PLEASE ENTER A VALID PASSWORD",
            });

        const userpayload = {
            id: user._id,
            role: user.role,
        };

        // create token
        const token = jwt.sign(userpayload, process.env.JWT_TOKEN, {
            expiresIn: "1h",
        });

        const dataInfo = {
            userId: user._id,
            email: user.email,
            token: token,
        };
        return res.status(200).json({
            message: "SUCCESFUL LOGIN",
            data: dataInfo,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

//GETUSER  PROFILE
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

//UPDATE USER INFORMATION
const updateUserInfo = async (req, res) => {
    const { username, email, password } = req.body;
    const Email = req.params.email;
    try {
        // Validate input
        if (!username && !email && !password) {
            return res.status(400).json({ error: "Please provide at least one field to update" });
        }

        // Update the user
        const userUpdate = await UserModel.updateOne({ Email: email },
            {
                username,
                email,
                password
            });

        // Check if any documents were modified
        if (userUpdate.nModified === 0) {
            return res.status(404).json({ error: "User not found or no changes applied" });
        }

        return res.json({ message: "User info updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//DELETE ACCOUNT
const deleteUserAccount = async (req, res) => {
    const id = req.params.id;
    try {
        await UserModel.findByIdAndDelete(id);
        res.json({
            message: "User account deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//USER LOGOUT
const userLogout = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({
                error: "USER DOES NOT EXIST",
            });
        return res.status(200).json({
            message: "User logged Out Succesfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: "internal server error"
        })
    }
};




module.exports = {
    userSignup,
    userVerification,
    userLogin,
    getUserProfile,
    updateUserInfo,
    deleteUserAccount,
    userLogout
}
