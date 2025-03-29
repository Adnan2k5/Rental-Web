import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname).toLowerCase(); // Get file extension
        const fileName = file.fieldname + "-" + crypto.randomUUID() + fileExt;
        cb(null, fileName);
    }
});

// Allowed file types (Images & Videos)
const allowedMimeTypes = [
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"
];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed!"), false);
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 50MB max file size
    fileFilter,
});
