// Importing required modules
const mongoose = require('mongoose');

// Creating a function to eastablish connection with DB
const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(error);
    }
};

// Exporting our module
module.exports = {dbConnect} ;