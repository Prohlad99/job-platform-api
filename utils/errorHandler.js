class ErrorHandler extends Error{
    constructor(message, statusCode){
        supper(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor)
    }
}


module.exports = ErrorHandler;