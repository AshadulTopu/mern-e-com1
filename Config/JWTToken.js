const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: './config.env' });

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // expires in 30 days, can be changed to any number of days or hours or minutes or seconds or milliseconds or any unit of time you want it to expire 
    });
}


module.exports = generateToken