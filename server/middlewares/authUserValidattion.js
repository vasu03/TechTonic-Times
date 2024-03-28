// Importing required modules
const errorHandler = require('./errorHandler');

// Custom validation function for user registration
const validateUserRegistration = (data) => {
  const { userName, email, password } = data;
  if(!userName || userName === ''){
    throw new Error("Username is required and can't be NULL");
  }
  if(!email || email === ''){
    throw new Error("Email is required and can't be NULL");
  }
  if(!password || password === '' || password.length < 8){
    throw new Error("Password is required and must have more than 8 characters");
  }
};

const validateUserLogin = (data) => {
    const { userName, email, password } = data;
  
    if(!email || email === ''){
      throw new Error("Email is required and can't be NULL");
    }
    if(!password || password === '' || password.length < 8){
      throw new Error("Password is required and must have more than 8 characters");
    }
};

module.exports = {
    validateUserRegistration,
    validateUserLogin
  };