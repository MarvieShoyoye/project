const express = require("express");
const UserModel = require("../models/usermodel");
const NewsModel = require("../models/newsmodel");
const StarModel = require("../models/starmodel");


const router = express.Router();

// CREATE STARRED NEWS 
router.post("/starnews", async (req, res) => {
    const { email, newsId } = req.body;
    try {
        // Validate input fields
        if (!email && !newsId)
            return res.status(400).json({
                error: "PLEASE PROVIDE BOTH EMAIL AND NEWS ID"
            });

        // Create starred news
        await StarModel.create({
            email,
            newsId,
        });

        return res.status(201).json({
            message: "NEWS ARTICLE STARRED SUCCESSFULLY"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
});


//GET NEWS ARTICLE
router.get("/profile",  async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await StarModel.findById(userId);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = router;