const mongoose = require("mongoose");

const starredNewsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    newsId: {
        type: String,
        required: true
    },
    starredNews: {
        type: Boolean,
        ref: "News",
        default: true
    }
},
    {
        timestamps: true,
    }
);

const StarModel = mongoose.model("starnews", starredNewsSchema);

module.exports = StarModel;
