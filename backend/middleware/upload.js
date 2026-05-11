const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpeg", ".jpg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx", ".txt"];
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const extname = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, PDFs, and documents are allowed.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { upload, handleMulterError };
