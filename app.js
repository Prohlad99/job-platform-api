const express = require('express');
const mongodb = require('mongodb');
const dotenv = require('dotenv');

//internal import
const jobs = require('./routes/jobs');
const auth = require('./routes/auth');
const connectDatabase = require('./config/database');
const errorHandleMiddleware = require('./middleware/errors');
const ErrorHandler = require('./utils/errorHandler');

//configurations
const app = express();
dotenv.config()
const PORT = process.env.PORT

//handling uncaught exception error
process.on('uncaughtException', err=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down due to uncaught exception error');
    process.exit(1);
})

//database connections
connectDatabase()


//setup body parser
app.use(express.json());

// routing 
app.use('/api/v1',jobs);
app.use('/api/v1', auth)

//handle unhandled routes
app.all('*', (req, res, next)=>{
    next(new ErrorHandler(`${req.originalUrl} route nof found`, 404));
})

//handle global error
app.use(errorHandleMiddleware);


const server = app.listen(PORT, ()=>{
    console.log(`I am listing port ${PORT}`)
})

//handling unhandled promise rejection
process.on('unhandledRejection', err=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    })
})

