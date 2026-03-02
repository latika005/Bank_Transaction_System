const userModel = require("../models/user.model.js");  
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next){

    console.log("JWT_SECRET:", process.env.JWT_SECRET); // 👈 Add here

    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1]; // Extract token from cookies or Authorization header

    if(!token){
        return res.status(401).json({
            message : "Unauthorized access, token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode it to get user information
        console.log(decoded);
        const user = await userModel.findById(decoded.id); // Find user in the database using the ID from the decoded token
        req.user = user;
        return next(); // Proceed to the next middleware or route handler
    }catch(err){
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({
            message : "Unauthorized access, invalid token"
        })
    }
}

module.exports = {authMiddleware};
