// Importing required modules
const jwt = require("jsonwebtoken");
const { errorHandler } = require("./errorHandler");

// Exporting our user verification function
exports.verifyUser = (req, res, next) => {
    // Get the token of the user
    const token  = req.cookies.token;
    if(!token){
        return next(errorHandler(401, "Unauthorized"));
    }
    
    // verify the obtained token
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if(err){
            return next(errorHandler(401, "Unauthorized"));
        }
        req.user = userData;
        next();
    });
};