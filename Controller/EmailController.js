const nodemailer = require("nodemailer")
const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv").config({ path: "./config.env" })
// const { google } = require("googleapis")
// const OAuth2 = google.auth.OAuth2
// const OAuth2 = require('google-auth-library').OAuth2;


// mailer config
const sendEmail = asyncHandler(async (data, req, res) => {

    // create a transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MP,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.htm
    })
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

})


module.exports = sendEmail