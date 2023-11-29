const dotenv = require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log(error);
        console.log('MongoDB connection failed');
    }
};

module.exports = dbConnection
