const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
    try {
        const headers = req.headers["authorization"];
        if (!headers)
            return res.status(401).json({ error: "Please enter a token" })

        const tokenHeader = headers.split(" ")[1];
        if (!tokenHeader)
            return res.status(401).json({ error: "Token is not found" });

        const decoded = jwt.verify(tokenHeader, process.env.JWT_TOKEN);
        if (!decoded)
            return res.status(401).json({ error: "Please enter a Valid Token" })

        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Acess is Restricted" })
    }
};

module.exports = isAuth;