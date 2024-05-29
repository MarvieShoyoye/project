const express = require("express");
const router = express.Router();
const NewsModel = require("../models/newsmodel");
const isAuth = require("../middleware/auth");

const {
    createNewsArticles,
    getNewsArticles,
    getAllNewsArticles,
    updateNewsArticle,
    deleteNewsArticle,
} = require("../controllers/newscontroller")

// CREATE A NEWS ARTICLE
router.post("/admins/create", isAuth, createNewsArticles);

//READ 
// GET NEWS ACCORDING TO CATEGORY //READ  //SPORTS//FINANCE//GOVERNMENT//EDUCATION
router.get("/:category", getNewsArticles);


//GET ALL THE NEWS 
router.get("/news", getAllNewsArticles);


// UPDATE NEWS ACCORDING TO CATEGORY
router.put("/update/:id", isAuth, updateNewsArticle);



// DELETE NEWS ARTICLE
router.delete("/delete/:id", isAuth, deleteNewsArticle);

module.exports = router;
