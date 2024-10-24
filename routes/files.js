const multer = require('multer');
const path = require('path');
const config = require('../config/config.js');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.file.uploads_directory); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        // Use the original file name, but you can also add a timestamp or a unique ID
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf-8').replace(path.extname(file.originalname), ''); // Get the original name without extension
        const extension = path.extname(file.originalname); // Get the extension
        cb(null, `${originalName}-${uniqueSuffix}${extension}`); // Retain original name and add unique suffix
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: config.file.max_file_size * 1024 * 1024, files: config.file.max_files }, // 2 MB file size limit
    fileFilter: (req, file, cb) => {

        const isMimeTypeAllowed = config.file.allowed_mime_types.includes(file.mimetype);
        const isExtensionAllowed = config.file.allowed_extensions.some(type => type === path.extname(file.originalname).toLowerCase());

        if (isMimeTypeAllowed && isExtensionAllowed) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed!'), false);
        }
    }
});

module.exports = {
    upload
};
