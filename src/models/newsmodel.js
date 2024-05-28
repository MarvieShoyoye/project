const mongoose = require("mongoose");

// Define the schema for the news model
const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Finance", "Government", "Sports", "Education"],
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    }
);

// Create the news model from the schema
const NewsModel = mongoose.model("News", newsSchema);

module.exports = NewsModel;
