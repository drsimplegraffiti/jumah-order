require('dotenv').config()

const cloudinary = require('cloudinary').v2;
import multer from 'multer';
import path from 'path';

//multer config

const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb: any) => {
        let ext = path.extname(file.originalname);
        if (ext != '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('File type is not supported'), false);
            return;
        }
        cb(null, true);
    },
});



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export {
    upload,
    cloudinary,
}
