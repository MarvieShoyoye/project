const express = require("express");
const UserModel = require("../models/usermodel");
const NewsModel = require("../models/newsmodel");
const StarModel = require("../models/starmodel");
const isAuth = require("../middleware/auth")


// CREATE STARRED NEWS
const createStarredNews = async (req, res) => {
    const { email, newsId } = req.body;
    try {
        // Validate input fields
        if (!email && !newsId)
            return res.status(400).json({
                error: "PLEASE PROVIDE BOTH EMAIL AND NEWS ID"
            });

        // Check if the news is already starred by the user
        const existingStar = await StarModel.findOne({ email, newsId });
        if (existingStar) {
            return res.status(400).json({
                error: "NEWS ARTICLE ALREADY STARRED BY THE USER"
            });
        }
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
};

//GET NEWS ARTICLE
const getNewsArticle = async (req, res) => {
    try {
        const userEmail = req.body.email;

        // Find all starred articles by the user
        const starredArticles = await StarModel.find({ email: userEmail });

        const newsIds = [];
        // Extract the news IDs from the starred articles
        for (const starredArticle of starredArticles) {
            newsIds.push(starredArticle.newsId);
        }

        // Fetch news articles corresponding to the extracted news IDs
        const newsArticles = await NewsModel.find({ _id: { $in: newsIds } });

        return res.status(200).json(newsArticles);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

//UPDATE STARRED NEWS
const updateStarredNews = async (req, res) => {
    const { newsId } = req.body;
    const email = req.params.email;
    try {
        if (!newsId) {
            return res.status(400).json({ error: "Please provide the 'newsId' to update" });
        }

        // Update the starred article
        const starredUpdate = await StarModel.updateOne(
            { email: email, newsId: newsId },
            { $set: { newsId: newsId } }
        );

        // Check if any documents were modified
        if (starredUpdate.nModified === 0) {
            return res.status(404).json({ error: "Starred article not found or no changes applied" });
        }

        return res.json({ message: "Starred article updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//DELETE ALL STARRED NEWS
const deleteAllStarredNews = async (req, res) => {
    try {
        // Ensure email is provided
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ error: "Please provide the user's email" });
        }

        // Delete all starred news for the user
        await StarModel.deleteMany({ email: userEmail });

        return res.status(200).json({ message: "All starred news deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = {
    createStarredNews,
    getNewsArticle,
    updateStarredNews,
    deleteAllStarredNews
}


