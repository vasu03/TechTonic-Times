// Importing required modules
const express = require("express");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./database/dbConnection");

// Importing the routes
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");

// Configuring the env file
const dotenv = require("dotenv");
dotenv.config();

// Creating our Express App
const app = express();

// Setting up the middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));        // Middleware to parse URL-encoded bodies
app.use(cookieParser());                                // Middleware to parse the cookies

// Setting up the routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

// Starting the Express App server

const PORT = process.env.PORT || 5000;
dbConnect().then(() => {
    console.log("Server Connected to DB...");
    app.listen(PORT, () => {
        console.log(`Server up & running at http://localhost:${PORT}`);
    })
});

// Express Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});