const NewsModel = require("../models/newsmodel");
const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth");


// CREATE A NEWS ARTICLE
const createNewsArticles = async (req, res) => {
    const { title, content, category, author } = req.body;
    const newsKey = "citizentimes2016";
    let authority = req.headers["buzzword"];
    if (authority !== newsKey)
        return res.status(401).json({
            error: "oopppss😯😯  ONLY ADMINS CAN ACCESS THIS ROUTE"
        })
    // note buzzword is the key while citizentimes2016 is the value
    try {
        const newNewsArticle = await NewsModel.create({
            title,
            content,
            category,
            author,
        });
        await newNewsArticle.save();
        res.status(201).json({
            message: "NEWS ARTICLE CREATED SUCCESSFULLY"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


//READ 
// GET NEWS ACCORDING TO CATEGORY //READ  //SPORTS//FINANCE//GOVERNMENT//EDUCATION

const getNewsArticles = async (req, res) => {
    const category = req.params.category;
    try {
        const newsArticles = await NewsModel.find({ category });
        res.json(newsArticles);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


//GET ALL THE NEWS 
const getAllNewsArticles = async (req, res) => {
    try {
        const newsArticles = await NewsModel.find({ all });
        res.json(newsArticles);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// UPDATE NEWS ACCORDING TO CATEGORY
const updateNewsArticle = async (req, res) => {
    const { title, content, category } = req.body;
    const id = req.params.id;

    const newsKey = "citizentimes2016";
    let authority = req.headers["buzzword"];
    if (authority !== newsKey)
        return res.status(401).json({
            error: "Only admins have access to this route."
        });

    try {
        // Update the news article
        const newsUpdate = await NewsModel.updateOne({ _id: id },
            { title, content, category });
        if (!newsUpdate) {
            return res.status(404).json({
                error: "News article not found or no changes made."
            });
        }
        return res.json({ message: "News article updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE NEWS ARTICLE
const deleteNewsArticle = async (req, res) => {
    const id = req.params.id;
    const newsKey = "citizentimes2016";
    let authority = req.headers["buzzword"];
    if (authority !== newsKey)
        return res.status(401).json({
            error: "Only admins have access to this route. Authorization key missing or invalid."
        });
    try {
        await NewsModel.findByIdAndDelete(id);
        res.json({
            message: "News article deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = {
    createNewsArticles,
    getNewsArticles,
    getAllNewsArticles,
    updateNewsArticle,
    deleteNewsArticle,
};