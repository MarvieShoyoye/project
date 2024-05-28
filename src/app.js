const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const connectDb = require("./db/db");
const userRoutes = require("./routes/userroutes");
const newsRoutes = require("./routes/newsroutes");
const adminRoutes = require("./routes/adminroutes");
const starRoutes = require("./routes/starroutes")

const port = process.env.PORT || 4444;

connectDb();

app.use(express.json());
app.use(bodyParser.json());


//custom middleware // mounting routes
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/starrednews", starRoutes);


app.listen(port, () =>
    console.log(`server is running on port ${port}`)
);