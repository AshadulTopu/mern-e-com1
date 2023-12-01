
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const asyncHandler = require('express-async-handler');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },

    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 2000000 // 2MB
    }
}) //.single('photo') // Use single() for a single file upload

const resizePhoto = asyncHandler(async (req, res, next) => {
    if (!req.files) return next(); // Check if there's an uploaded file
    await Promise.allSettled(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize({ width: 300, height: 300 })
                .toFormat('jpeg') // Convert the image to JPEG
                .jpeg({ quality: 90 })
                .toFile(`public/uploads/${file.filename}`);
        })
    )
    next();
});

module.exports = {
    uploadPhoto,
    resizePhoto
};



// const multer = require('multer');
// const sharp = require('sharp');
// const path = require('path');
// // const { Promise } = require('mongoose');
// const asyncHandler = require('express-async-handler');


// // multer storage function for images upload to cloudinary
// // first upload into local storage and then upload to cloudinary
// const multerStorage = multer.diskStorage({
//     //setup upload destination
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../public/uploads'));
//     },
//     //setup filename
//     filename: (req, file, cb) => {

//         //get file name
//         // const fileName = file.originalname.split(' ').join('-');
//         // cb(null, `${Date.now()}-${file.originalname}`);

//         //get file extension
//         const ext = file.mimetype.split('/')[1];
//         // cb(null, `image-${Date.now()}.${ext}`);

//         // uniqueSuffix
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // 1E9 = 1000000000 = 10^9 = 1,000,000,000

//         // check file extension
//         if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'webp' || ext === 'svg') {
//             cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
//         } else {
//             cb(new Error('Not an image! Please upload only images.'), false);
//         }
//     }
// },
//     console.log('multer storage called')
// )

// // multer filter
// const multerFilter = (req, file, cb) => {
//     console.log('multer filter called');
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Not an image! Please upload only images.'), false);
//     }
// };

// // upload photo
// const uploadPhoto = multer({
//     // dest: 'public/uploads',
//     storage: multerStorage,
//     fileFilter: multerFilter,
//     limits: {
//         fileSize: 2000000 // 2MB
//     }
// },
//     console.log('upload photo called')
// );


// // resize image
// const resizePhoto = asyncHandler(async (req, res, next) => {
//     console.log('resize photo called');
//     if (!req.file) return next();
//     // req.file.filename = `image-${Date.now()}-${req.file.originalname}`;
//     await Promise.all(
//         req.files.map(async (file) => {
//             await sharp(file.path)
//                 .resize({ width: 300, height: 300 })
//                 .toFormat('jpeg')
//                 .jpeg({ quality: 90 })
//                 .toFile(`public/uploads/${file.filename}`)
//         })
//     );
//     next();
// });


// module.exports = {
//     uploadPhoto,
//     resizePhoto
// }























// // upload image
// // multer filter
// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Not an image! Please upload only images.'), false);
//     }
// };

// // setup filename
// const filename = (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
// };

// // setup upload destination
// const destination = (req, file, cb) => {
//     cb(null, path.join(__dirname, '../public/uploads'));
// };

// // upload image
// const uploadImage = multer({
//     storage: multer.diskStorage({
//         destination: destination,
//         filename: filename
//     }),
//     fileFilter: multerFilter,
//     limits: {
//         fileSize: 2000000 // 2MB
//     }
// });