const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const con = await mongoose.connect(process.env.DB_LOCAL_URI, {
           
        });
        console.log(`MongoDB database connected with host: ${con.connection.host}`);
    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
};

module.exports = connectDatabase;