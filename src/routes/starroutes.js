const express = require("express");
const UserModel = require("../models/usermodel");
const NewsModel = require("../models/newsmodel");
const StarModel = require("../models/starmodel");
const isAuth = require("../middleware/auth")

const router = express.Router();

const {
    createStarredNews,
    getNewsArticle,
    updateStarredNews,
    deleteAllStarredNews
} = require("../controllers/starcontroller")

// CREATE STARRED NEWS 
router.post("/starnews", createStarredNews);


//GET NEWS ARTICLE
router.get("/starred", getNewsArticle);

//UPDATE STARRED NEWS 
router.put("/update/:email", updateStarredNews);


//DELETE ALL STARRED NEWS 
router.delete("/delete", deleteAllStarredNews);

module.exports = router;