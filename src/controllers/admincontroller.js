const express = require("express");
const AdminModel = require("../models/adminmodel");
const argon2 = require("argon2");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const isAuth = require("../middleware/auth");
const UserModel = require("../models/usermodel");
const SendEmail = require("../mailer/mailer");


//ADMIN ACCOUNT CREATION
const adminCreation = async (req, res) => {
    const { adminName, email, password } = req.body;
    const adminKey = "timesCitizen2024";
    let authority = req.headers["buzzword"];
    if (authority !== adminKey)
        return res.status(401).json({ error: "only admin can use this route " })
    // note buzzword is the key while timesCitizen2024 is the value
    try {
        if (!adminName && !email && !password)
            return res.status(400)({
                error: "PLEASE FILL ALL FIELDS",
            });
        const validAdminName = validator.isAlphanumeric(adminName)
        const validEmail = validator.isEmail(email);
        const validPassword = validator.isStrongPassword(password);

        if (!validAdminName)
            return res.status(400).json({
                error: "INVALID ADMIN NAME "
            });
        if (!validEmail)
            return res.status(400).json({
                error: "INVALID EMAIL"
            });
        if (!validPassword)
            return res.status(400).json({
                error: "PLEASE ENTER A STRONG PASSWORD CONTAINING AN UPPERCASE, LOWERCASE, SPECIAL CHARACTER, AND  AT LEAST 8 DIGITS CHARCTER "
            });
        const AdminExist = await AdminModel.findOne({ email });
        if (AdminExist)
            return res.status(409).json({
                error: "ADMIN ALREADY EXIST",
            });

        const generateRandomOtp = () => {
            const randomNum = Math.random() * 9000;
            const formattedRandomNum = Math.floor(randomNum);
            return formattedRandomNum;
        };

        const hashedPassword = await argon2.hash(password);

        const admin = await AdminModel.create({
            adminName,
            email,
            password: hashedPassword,
            otp: generateRandomOtp(),
        });
        await SendEmail(
            email,
            "Admin Account Creation",
            `Hi ${admin.name} Admin account created`,
            `<body> 
              <p>Name: ${admin.adminName}</p>
              <p>Email: ${admin.email}</p>
              <p>Hello ${admin.adminName} your account has been created as an admin.</p>
             </body>`
        );
        return res.status(201).json({
            success: true,
            message: "admin created successfuly",
            data: admin
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};


//ADMIN VERIFICATION
const adminVerification = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email && !otp)
            return res.status(400).json({ error: "please fill all fields" });

        const admin = await AdminModel.findOne({ email });

        if (!admin) return res.status(404).json({ error: "admin not found" });

        if (admin.isVerified)
            return res.status(400).json({ error: "admin already verified" });

        if (!admin.otp) return res.status(404).json({ error: "otp not found" });

        // verify the user using otp
        if (admin.otp != otp) return res.status(400).json({ error: "Invalid otp" });

        admin.isVerified = true;
        admin.otp = null;
        await admin.save();

        return res.status(200).json({ message: "admin verified successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "internal server error" + error });
    }
};

/// ADMIN LOGIN
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin)
            return res.status(404).json({
                error: "ADMIN DOES NOT EXIST",
            });

        const validPassword = await argon2.verify(admin.password, password);
        if (!validPassword)
            return res.status(400).json({
                error: "INVALID PASSWORD",
            });

        const adminPayload = {
            id: admin._id,
            role: admin.role,
        };

        // CREATE TOKEN
        const token = jwt.sign(adminPayload, process.env.JWT_TOKEN, {
            expiresIn: "15m",
        });

        const dataInfo = {
            adminId: admin._id,
            email: admin.email,
            token: token,
        };
        return res.status(200).json({
            message: "ADMIN LOGGED IN SUCCESSFULLY",
            data: dataInfo,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

//GET ADMIN PROFILE
const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const admin = await AdminModel.findById(adminId);
        return res.status(200).json(admin);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

// UPDATE ADMIN INFOMATION
const updateAdminInfo = async (req, res) => {
    const { adminName, email, password } = req.body;
    const Email = req.params.email;
    try {
        // Validate input
        if (!adminName && !email && !password) {
            return res.status(400).json({ error: "Please provide at least one field to update" });
        }

        // Update the user
        const AdminUpdate = await AdminModel.updateOne({ Email: email },
            {
                dminName,
                email,
                password
            });

        // Check if any documents were modified
        if (AdminUpdate.nModified === 0) {
            return res.status(404).json({ error: "User not found or no changes applied" });
        }
        return res.json({ message: "admin info updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//DELETE ADMIN ACCOUNT
const deleteAdmin = async (req, res) => {
    const id = req.params.id;
    const adminKey = "citizentimes2018";
    let authority = req.headers["Fired"];
    if (authority !== adminKey)
        return res.status(401).json({
            error: "Only admins have access to this route. Authorization key missing or invalid."
        });
    try {
        await AdminModel.findByIdAndDelete(id);
        res.json({
            message: "Admin account deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//ADMIN LOGOUT
const adminLogout = async (req, res) => {
    const email = req.params.email;
    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin)
            return res.status(404).json({
                error: "ADMIN DOES NOT EXIST",
            });
        return res.status(200).json({
            message: "ADMIN logged Out Succesfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: "internal server error"
        })
    }
};

//DISABLE A USER USING THE PUT VERB
const disableUser = async (req, res) => {
    const userIdToDisable = req.params.userId;
    const { email } = req.body;
    try {
        const adminKey = "timesCitizen2024";
        let authority = req.headers["buzzword"];
        if (authority !== adminKey)
            return res.status(401).json({ error: "only admin can use this route " })
        // note buzzword is the key while timesCitizen2024 is the value

        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({
                error: "user does not exist"
            })
        return res.status(200).json({
            message: "USER DISABLED SUCCESSFULLY"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });
    }
};



module.exports = {
    adminCreation,
    adminVerification,
    adminLogin,
    getAdminProfile,
    updateAdminInfo,
    deleteAdmin,
    adminLogout,
    disableUser
};