const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/CitizenTimes");
        console.log("Connected to Database");
    } catch (error) {
        console.log(error);
    }
};


module.exports = connectDb;