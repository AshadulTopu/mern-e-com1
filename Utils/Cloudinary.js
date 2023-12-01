// import { v2 as cloudinary } from 'cloudinary';
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config({ path: './config.env' });

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.CLOUDE_API_KEY,
    api_secret: process.env.CLOUDE_API_SECRET
});

// upload images
const CloudinaryUploadImages = async (fileToUpload) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUpload, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.secure_url,
                },
                    {
                        resource_type: "auto"
                    }
                );
            }
        });
    })
}


module.exports = CloudinaryUploadImages