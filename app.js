const express = require('express');
const mongodb = require('mongodb');
const dotenv = require('dotenv');

//internal import
const jobs = require('./routes/jobs');
const connectDatabase = require('./config/database');

//configurations
const app = express();
dotenv.config()
const PORT = process.env.PORT

//database connections
connectDatabase()

//setup body parser
app.use(express.json());

// routing 
app.use('/api/v1',jobs);




app.listen(PORT, ()=>{
    console.log(`I am listing port ${PORT}`)
})