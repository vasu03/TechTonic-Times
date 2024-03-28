// Exporting our Error Handler function
exports.errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;

    return error;
};
