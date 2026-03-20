const userModel = require("../models/user.model.js");  
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next){

    // console.log("JWT_SECRET:", process.env.JWT_SECRET); // 👈 Add here

    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1]; // Extract token from cookies or Authorization header

    if(!token){
        return res.status(401).json({
            message : "Unauthorized access, token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode it to get user information
        // console.log(decoded);
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

async function authSystemUserMiddleware(req, res, next){
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1]; // Extract token from cookies or Authorization header
    // console.log(token);
    if(!token){
        return res.status(401).json({
            message : "Unauthorized access, token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode it to get user information  //.select("+systemUser")

        const user = await userModel.findById(decoded.id).select("+systemUser")
        if(!user.systemUser){ // 403 - user is forbidden from accessing this resource, even though they are authenticated
            return res.status(403).json({
                message : "Forbidden access, not a system user"
            })
        }
        req.user = user

        return next();
        
    }catch(err){
        console.log(err);
        return res.status(401).json({
            message : "Unauthorized access, token is invalid"
        })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
};
